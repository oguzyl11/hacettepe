"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-state";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { commentSchema, validationMessage } from "@/lib/validations";

export async function addComment(
  itemId: string,
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };

  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };
  if (!rateLimit(`msg:${student.id}`, 20, 10 * 60 * 1000)) {
    return { success: false, message: t.errors.rateLimited };
  }

  const parsed = commentSchema.safeParse({
    text: formData.get("body") ?? formData.get("text"),
  });
  if (!parsed.success) return { success: false, message: validationMessage(parsed.error) };

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, status: true },
    });
    if (!item) return { success: false, message: t.errors.notFound };
    if (item.status !== "ACTIVE") return { success: false, message: t.errors.forbidden };

    const comment = await prisma.comment.create({
      data: { body: parsed.data.text, itemId, authorId: student.id },
    });
    revalidatePath(`/ilan/${itemId}`);
    return { success: true, message: t.errors.messageSaved, data: { id: comment.id } };
  } catch (error) {
    logger.error("message.create", error);
    return { success: false, message: t.errors.unavailable };
  }
}

export async function deleteComment(commentId: string, itemId: string): Promise<ActionResult> {
  const { t } = await getServerDictionary();
  const student = await currentStudent();
  if (!student) return { success: false, message: t.errors.signIn };
  const prisma = getPrisma();
  if (!prisma) return { success: false, message: t.errors.database };

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, itemId: true },
    });
    if (!comment || comment.itemId !== itemId) return { success: false, message: t.errors.notFound };
    if (comment.authorId !== student.id) return { success: false, message: t.errors.forbidden };
    await prisma.comment.delete({ where: { id: comment.id } });
    revalidatePath(`/ilan/${itemId}`);
    return { success: true, message: t.errors.deleted };
  } catch (error) {
    logger.error("message.delete", error);
    return { success: false, message: t.errors.unavailable };
  }
}
