"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-state";
import { imageFiles, removeStoredImages, uploadImages } from "@/lib/blob";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { insertItemSchema, validationMessage } from "@/lib/validations";

function photoMessage(error: "limit" | "type" | undefined, limit: string, type: string) {
  if (error === "limit") return limit;
  if (error === "type") return type;
  return null;
}

export async function createItem(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };

  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };
  if (!rateLimit(`item:${student.id}`, 10, 60 * 60 * 1000)) {
    return { success: false, message: t.errors.rateLimited };
  }

  const parsed = insertItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
  });
  if (!parsed.success) return { success: false, message: validationMessage(parsed.error) };

  const uploaded = await uploadImages(imageFiles(formData, "images"), "ilan");
  const photoError = photoMessage(uploaded.error, t.errors.photoLimit, t.errors.photoType);
  if (photoError) return { success: false, message: photoError };

  let itemId = "";
  try {
    const item = await prisma.item.create({
      data: {
        ...parsed.data,
        images: uploaded.urls,
        ownerId: student.id,
      },
    });
    itemId = item.id;
  } catch (error) {
    logger.error("listing.create", error);
    await removeStoredImages(uploaded.urls);
    return { success: false, message: t.errors.listingSaved };
  }

  revalidatePath("/");
  revalidatePath("/ilanlarim");
  redirect(`/ilan/${itemId}`);
}

export async function deleteItem(itemId: string): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };
  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true, status: true, images: true, rating: { select: { id: true } } },
    });
    if (!item) return { success: false, message: t.errors.notFound };
    if (item.ownerId !== student.id) return { success: false, message: t.errors.forbidden };

    await prisma.item.delete({ where: { id: item.id } });
    if (item.status === "SOLD") {
      await prisma.user.update({
        where: { id: student.id },
        data: { soldCount: { decrement: 1 } },
      });
    }
    if (item.rating) {
      const aggregate = await prisma.rating.aggregate({
        where: { sellerId: student.id },
        _avg: { score: true },
        _count: true,
      });
      await prisma.user.update({
        where: { id: student.id },
        data: {
          ratingAverage: aggregate._avg.score ?? 0,
          ratingCount: aggregate._count,
        },
      });
    }
    await removeStoredImages(item.images);
  } catch (error) {
    logger.error("listing.delete", error);
    return { success: false, message: t.errors.unavailable };
  }

  revalidatePath("/");
  revalidatePath("/ilanlarim");
  revalidatePath(`/profil/${student.id}`);
  redirect("/ilanlarim");
}
