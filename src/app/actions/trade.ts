"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-state";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { applyRating, canMarkSold, canRate } from "@/lib/trade";
import { z } from "zod";

const scoreSchema = z.coerce.number().int().min(1).max(5);

async function refreshSeller(sellerId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  const aggregate = await prisma.rating.aggregate({
    where: { sellerId },
    _avg: { score: true },
    _count: true,
  });
  await prisma.user.update({
    where: { id: sellerId },
    data: {
      ratingAverage: aggregate._avg.score ?? 0,
      ratingCount: aggregate._count,
    },
  });
}

function formId(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !/^[a-z0-9]{8,40}$/i.test(value)) return null;
  return value;
}

export async function markSold(formData: FormData): Promise<void> {
  const itemId = formId(formData, "itemId");
  const buyerId = formId(formData, "buyerId");
  const student = await currentStudent();
  if (!student || !itemId || !buyerId) return;
  const prisma = getPrisma();
  if (!prisma) return;

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        ownerId: true,
        status: true,
        comments: { select: { authorId: true } },
      },
    });
    if (!item) return;
    const allowed = canMarkSold({
      actorId: student.id,
      ownerId: item.ownerId,
      buyerId,
      status: item.status,
      commenterIds: item.comments.map((comment) => comment.authorId),
    });
    if (!allowed) return;

    const updated = await prisma.item.updateMany({
      where: { id: itemId, ownerId: student.id, status: "ACTIVE" },
      data: { status: "SOLD", buyerId, soldAt: new Date() },
    });
    if (updated.count !== 1) return;
    await prisma.user.update({
      where: { id: student.id },
      data: { soldCount: { increment: 1 } },
    });
    revalidatePath("/");
    revalidatePath(`/ilan/${itemId}`);
    revalidatePath(`/profil/${student.id}`);
  } catch (error) {
    logger.error("listing.sell", error);
  }
}

export async function rateSeller(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };
  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };

  const itemId = formId(formData, "itemId");
  const parsed = scoreSchema.safeParse(formData.get("score"));
  if (!itemId || !parsed.success) return { success: false, message: t.errors.invalid };

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        status: true,
        buyerId: true,
        ownerId: true,
        rating: { select: { id: true } },
      },
    });
    if (!item) return { success: false, message: t.errors.notFound };
    const allowed = canRate({
      actorId: student.id,
      buyerId: item.buyerId,
      status: item.status,
      alreadyRated: Boolean(item.rating),
    });
    if (!allowed) return { success: false, message: t.errors.forbidden };

    const seller = await prisma.user.findUnique({
      where: { id: item.ownerId },
      select: { ratingAverage: true, ratingCount: true },
    });
    if (!seller) return { success: false, message: t.errors.notFound };
    const next = applyRating(seller, parsed.data);
    await prisma.$transaction([
      prisma.rating.create({
        data: {
          score: parsed.data,
          itemId,
          sellerId: item.ownerId,
          raterId: student.id,
        },
      }),
      prisma.user.update({
        where: { id: item.ownerId },
        data: next,
      }),
    ]);
    revalidatePath("/");
    revalidatePath(`/ilan/${itemId}`);
    revalidatePath(`/profil/${item.ownerId}`);
    return { success: true, message: t.errors.rated };
  } catch (error) {
    logger.error("listing.rate", error);
    return { success: false, message: t.errors.unavailable };
  }
}

export async function recomputeSellerScore(sellerId: string) {
  await refreshSeller(sellerId);
}
