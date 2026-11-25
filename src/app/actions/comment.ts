"use server";

import { revalidatePath } from "next/cache";
import { currentStudent } from "@/lib/current-student";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { commentSchema } from "@/lib/validations";

function formId(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !/^[a-z0-9]{8,40}$/i.test(value)) return null;
  return value;
}

export async function addComment(formData: FormData): Promise<void> {
  const student = await currentStudent();
  if (!student) return;

  const prisma = getPrisma();
  if (!prisma) return;
  if (!rateLimit(`msg:${student.id}`, 20, 10 * 60 * 1000)) return;

  const itemId = formId(formData, "itemId");
  if (!itemId) return;

  const parsed = commentSchema.safeParse({
    text: formData.get("body") ?? formData.get("text"),
  });
  if (!parsed.success) return;

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, status: true },
    });
    if (!item || item.status !== "ACTIVE") return;

    await prisma.comment.create({
      data: { body: parsed.data.text, itemId, authorId: student.id },
    });
    revalidatePath(`/ilan/${itemId}`);
  } catch (error) {
    logger.error("message.create", error);
  }
}

export async function deleteComment(formData: FormData): Promise<void> {
  const commentId = formId(formData, "commentId");
  const itemId = formId(formData, "itemId");
  const student = await currentStudent();
  if (!student || !commentId || !itemId) return;
  const prisma = getPrisma();
  if (!prisma) return;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, itemId: true },
    });
    if (!comment || comment.itemId !== itemId || comment.authorId !== student.id) return;
    await prisma.comment.delete({ where: { id: comment.id } });
    revalidatePath(`/ilan/${itemId}`);
  } catch (error) {
    logger.error("message.delete", error);
  }
}
