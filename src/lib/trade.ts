export type ItemTradeStatus = "ACTIVE" | "SOLD";

export function canMarkSold(input: {
  actorId: string;
  ownerId: string;
  buyerId: string;
  status: ItemTradeStatus;
  commenterIds: string[];
}) {
  if (input.status !== "ACTIVE") return false;
  if (input.actorId !== input.ownerId) return false;
  if (input.buyerId === input.ownerId) return false;
  return input.commenterIds.includes(input.buyerId);
}

export function canRate(input: {
  actorId: string;
  buyerId: string | null;
  status: ItemTradeStatus;
  alreadyRated: boolean;
}) {
  if (input.alreadyRated) return false;
  if (input.status !== "SOLD") return false;
  if (!input.buyerId) return false;
  return input.actorId === input.buyerId;
}

export function applyRating(
  current: { ratingAverage: number; ratingCount: number },
  score: number,
) {
  const ratingCount = current.ratingCount + 1;
  const ratingAverage =
    (current.ratingAverage * current.ratingCount + score) / ratingCount;
  return { ratingAverage, ratingCount };
}

export type PublicOwner = {
  id: string;
  name: string;
  image: string | null;
  instagramHandle: string | null;
  preferredContact: "EMAIL" | "INSTAGRAM";
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
};

export function toPublicOwner(
  owner: PublicOwner & { email?: string },
  fallbackName: string,
): PublicOwner {
  return {
    id: owner.id,
    name: owner.name.trim() || fallbackName,
    image: owner.image,
    instagramHandle: owner.instagramHandle,
    preferredContact: owner.preferredContact,
    ratingAverage: owner.ratingAverage,
    ratingCount: owner.ratingCount,
    soldCount: owner.soldCount,
  };
}
