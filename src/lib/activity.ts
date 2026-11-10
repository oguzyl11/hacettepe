import { getPrisma } from "@/lib/prisma";

export async function getTradeActivity(userId: string) {
  const prisma = getPrisma();
  const empty = { incoming: [], outgoing: [], listings: [] };
  if (!prisma) return empty;

  try {
    const [incoming, outgoing, listings] = await Promise.all([
      prisma.offer.findMany({
        where: { item: { ownerId: userId } },
        include: {
          item: { select: { id: true, title: true } },
          sender: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.offer.findMany({
        where: { senderId: userId },
        include: {
          item: {
            select: {
              id: true,
              title: true,
              owner: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.item.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { offers: true, comments: true } } },
      }),
    ]);
    return { incoming, outgoing, listings };
  } catch (error) {
    console.error(error);
    return empty;
  }
}
