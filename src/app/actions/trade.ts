"use server";

import { revalidateLocalized } from "@/lib/revalidate-localized";
import { currentStudent } from "@/lib/current-student";
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
    revalidateLocalized(["/", `/ilan/${itemId}`, `/profil/${student.id}`]);
  } catch (error) {
    logger.error("listing.sell", error);
  }
}

export async function rateSeller(formData: FormData): Promise<void> {
  const student = await currentStudent();
  if (!student) return;
  const prisma = getPrisma();
  if (!prisma) return;

  const itemId = formId(formData, "itemId");
  const parsed = scoreSchema.safeParse(formData.get("score"));
  if (!itemId || !parsed.success) return;

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
    if (!item) return;
    const allowed = canRate({
      actorId: student.id,
      buyerId: item.buyerId,
      status: item.status,
      alreadyRated: Boolean(item.rating),
    });
    if (!allowed) return;

    const seller = await prisma.user.findUnique({
      where: { id: item.ownerId },
      select: { ratingAverage: true, ratingCount: true },
    });
    if (!seller) return;
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
    revalidateLocalized(["/", `/ilan/${itemId}`, `/profil/${item.ownerId}`]);
  } catch (error) {
    logger.error("listing.rate", error);
  }
}

export async function recomputeSellerScore(sellerId: string) {
  await refreshSeller(sellerId);
}
