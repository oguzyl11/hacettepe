"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-state";
import { currentStudent } from "@/lib/current-student";
import { getPrisma } from "@/lib/prisma";
import { commentSchema, validationMessage } from "@/lib/validations";

export async function addComment(
  itemId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const student = await currentStudent();
  if (!student) {
    return { success: false, message: "Yorum için giriş yap." };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return { success: false, message: "Veritabanı bağlı değil." };
  }

  const parsed = commentSchema.safeParse({
    text: formData.get("body") ?? formData.get("text"),
  });
  if (!parsed.success) {
    return { success: false, message: validationMessage(parsed.error) };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true },
    });
    if (!item) return { success: false, message: "İlan bulunamadı." };

    const comment = await prisma.comment.create({
      data: { body: parsed.data.text, itemId, authorId: student.id },
    });
    revalidatePath(`/ilan/${itemId}`);
    return { success: true, message: "Yorumun eklendi.", data: { id: comment.id } };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Yorum kaydedilemedi." };
  }
}
