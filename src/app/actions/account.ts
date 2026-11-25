"use server";

import { revalidateLocalized } from "@/lib/revalidate-localized";
import { signOut } from "@/auth";
import { removeStoredImages } from "@/lib/blob";
import { currentStudent } from "@/lib/current-student";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";

export async function deleteAccount(formData: FormData): Promise<void> {
  if (formData.get("confirm") !== "yes") return;
  const student = await currentStudent();
  if (!student) return;
  const prisma = getPrisma();
  if (!prisma) return;

  try {
    const [user, items, given] = await Promise.all([
      prisma.user.findUnique({ where: { id: student.id }, select: { image: true } }),
      prisma.item.findMany({ where: { ownerId: student.id }, select: { images: true } }),
      prisma.rating.findMany({ where: { raterId: student.id }, select: { sellerId: true } }),
    ]);
    const sellerIds = [...new Set(given.map((rating) => rating.sellerId))];
    const urls = [
      ...(user?.image ? [user.image] : []),
      ...items.flatMap((item) => item.images),
    ];
    await prisma.user.delete({ where: { id: student.id } });
    await Promise.all(
      sellerIds.map(async (sellerId) => {
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
      }),
    );
    await removeStoredImages(urls);
  } catch (error) {
    logger.error("account.delete", error);
    return;
  }

  revalidateLocalized(["/"]);
  await signOut({ redirectTo: "/" });
}
