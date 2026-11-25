"use server";

import { revalidatePath } from "next/cache";
import { revalidateLocalized } from "@/lib/revalidate-localized";
import type { ActionResult } from "@/lib/action-state";
import { imageFiles, removeStoredImages, uploadImages } from "@/lib/blob";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { profileSchema, validationMessage } from "@/lib/validations";

export async function updateProfile(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };

  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    instagramHandle: formData.get("instagramHandle") ?? "",
    preferredContact: formData.get("preferredContact"),
  });
  if (!parsed.success) return { success: false, message: validationMessage(parsed.error) };

  const pictures = imageFiles(formData, "avatar");
  const uploaded = await uploadImages(pictures.slice(0, 1), "profil");
  if (uploaded.error === "type") return { success: false, message: t.errors.photoType };
  if (uploaded.error === "limit") return { success: false, message: t.errors.photoLimit };

  try {
    const existing = await prisma.user.findUnique({
      where: { id: student.id },
      select: { image: true },
    });
    const user = await prisma.user.update({
      where: { id: student.id },
      data: {
        name: parsed.data.name,
        instagramHandle: parsed.data.instagramHandle || null,
        preferredContact: parsed.data.preferredContact,
        ...(uploaded.urls[0] ? { image: uploaded.urls[0] } : {}),
      },
    });
    if (uploaded.urls[0] && existing?.image && existing.image !== uploaded.urls[0]) {
      await removeStoredImages([existing.image]);
    }
    revalidateLocalized(["/profil", `/profil/${student.id}`]);
    revalidatePath("/[locale]/ilan/[id]", "page");
    return {
      success: true,
      message: t.errors.profileSaved,
      data: { image: user.image },
    };
  } catch (error) {
    logger.error("profile.update", error);
    return { success: false, message: t.errors.unavailable };
  }
}
