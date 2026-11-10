"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-state";
import { imageFiles, uploadImages } from "@/lib/blob";
import { currentStudent } from "@/lib/current-student";
import { getPrisma } from "@/lib/prisma";
import { profileSchema, validationMessage } from "@/lib/validations";

export async function updateProfile(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const student = await currentStudent();
  if (!student) {
    return { success: false, message: "Profil için giriş yap." };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return { success: false, message: "Veritabanı bağlı değil." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    instagramHandle: formData.get("instagramHandle") ?? "",
    preferredContact: formData.get("preferredContact"),
  });
  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  const pictures = imageFiles(formData, "avatar");
  const uploaded = await uploadImages(pictures.slice(0, 1), "profil");
  if (uploaded.error) {
    return { success: false, message: uploaded.error };
  }

  try {
    const user = await prisma.user.update({
      where: { id: student.id },
      data: {
        name: parsed.data.name,
        instagramHandle: parsed.data.instagramHandle || null,
        preferredContact: parsed.data.preferredContact,
        ...(uploaded.urls[0] ? { image: uploaded.urls[0] } : {}),
      },
    });
    revalidatePath("/profil");
    revalidatePath("/ilan/[id]", "page");
    return {
      success: true,
      message: "Profilin güncellendi.",
      data: { image: user.image },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Profil kaydedilemedi." };
  }
}
