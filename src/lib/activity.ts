import { getPrisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function getMyListings(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return { items: [], unavailable: true };

  try {
    const items = await prisma.item.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        condition: true,
        status: true,
        images: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    });
    return { items, unavailable: false };
  } catch (error) {
    logger.error("my-listings.read", error);
    return { items: [], unavailable: true };
  }
}

export async function getPublicProfile(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return { profile: null, unavailable: true };

  try {
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        instagramHandle: true,
        ratingAverage: true,
        ratingCount: true,
        soldCount: true,
        items: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            images: true,
            status: true,
          },
        },
      },
    });
    return { profile, unavailable: false };
  } catch (error) {
    logger.error("profile.read", error);
    return { profile: null, unavailable: true };
  }
}
