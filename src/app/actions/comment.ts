"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-state";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { commentSchema, validationMessage } from "@/lib/validations";

function formId(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !/^[a-z0-9]{8,40}$/i.test(value)) return null;
  return value;
}

export async function addComment(
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

  const itemId = formId(formData, "itemId");
  if (!itemId) return { success: false, message: t.errors.invalid };

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
