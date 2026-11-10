"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-state";
import { uploadImages, imageFiles } from "@/lib/blob";
import { currentStudent } from "@/lib/current-student";
import { getPrisma } from "@/lib/prisma";
import { insertItemSchema, validationMessage } from "@/lib/validations";

export async function createItem(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const student = await currentStudent();
  if (!student) {
    return { success: false, message: "İlan vermek için giriş yap." };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return { success: false, message: "Veritabanı bağlı değil." };
  }

  const parsed = insertItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
  });
  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  const uploaded = await uploadImages(imageFiles(formData, "images"), "ilan");
  if (uploaded.error) {
    return { success: false, message: uploaded.error };
  }

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
    console.error(error);
    return { success: false, message: "İlan kaydedilemedi." };
  }

  revalidatePath("/");
  revalidatePath("/ilanlarim");
  redirect(`/ilan/${itemId}`);
}
