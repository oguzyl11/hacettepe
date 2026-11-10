import { getPrisma } from "@/lib/prisma";

export async function getMyListings(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    return await prisma.item.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true } } },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
