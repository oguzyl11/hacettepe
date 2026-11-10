import type { Comment, Item, User } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { isContactMethod, isItemCategory, isItemCondition } from "@/lib/labels";
import { sampleListings } from "@/lib/sample-data";

export type ListingComment = {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
};

export type ListingOwner = {
  id: string;
  name: string;
  email: string;
  instagramHandle: string | null;
  preferredContact: User["preferredContact"];
  image?: string | null;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: Item["category"];
  condition: Item["condition"];
  images: string[];
  createdAt: string;
  commentCount: number;
  owner: ListingOwner;
  comments: ListingComment[];
};

export type ListingQuery = {
  listings: Listing[];
  usingSamples: boolean;
};

type ItemWithOwner = Item & {
  owner: User;
  comments?: (Comment & { author: User })[];
  _count?: { comments: number };
};

function toListing(item: ItemWithOwner): Listing {
  const comments = (item.comments ?? []).map((comment) => ({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    authorName: comment.author.name?.trim() || "Öğrenci",
  }));

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    condition: item.condition,
    images: item.images,
    createdAt: item.createdAt.toISOString(),
    commentCount: item._count?.comments ?? comments.length,
    owner: {
      id: item.owner.id,
      name: item.owner.name?.trim() || "Öğrenci",
      email: item.owner.email,
      instagramHandle: item.owner.instagramHandle,
      preferredContact: item.owner.preferredContact,
      image: item.owner.image,
    },
    comments,
  };
}

function filterSamples(filters: ListingFilters) {
  return sampleListings.filter((listing) => {
    if (filters.category && listing.category !== filters.category) return false;
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (filters.contact && listing.owner.preferredContact !== filters.contact) {
      return false;
    }
    if (filters.query) {
      const haystack = `${listing.title} ${listing.description}`.toLocaleLowerCase("tr");
      if (!haystack.includes(filters.query.toLocaleLowerCase("tr"))) return false;
    }
    return true;
  });
}

export type ListingFilters = {
  category?: string;
  condition?: string;
  contact?: string;
  query?: string;
};

export async function getListings(filters: ListingFilters = {}): Promise<ListingQuery> {
  const category = filters.category && isItemCategory(filters.category) ? filters.category : undefined;
  const condition = filters.condition && isItemCondition(filters.condition) ? filters.condition : undefined;
  const contact = filters.contact && isContactMethod(filters.contact) ? filters.contact : undefined;
  const query = filters.query?.trim();
  const normalized: ListingFilters = { category, condition, contact, query };

  const prisma = getPrisma();
  if (!prisma) {
    return { listings: filterSamples(normalized), usingSamples: true };
  }

  try {
    const items = await prisma.item.findMany({
      where: {
        category,
        condition,
        owner: contact ? { preferredContact: contact } : undefined,
        OR: query
          ? [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        owner: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { listings: items.map(toListing), usingSamples: false };
  } catch (error) {
    console.error("İlanlar okunamadı, örnek veri kullanılıyor.", error);
    return { listings: filterSamples(normalized), usingSamples: true };
  }
}

export async function getListing(id: string): Promise<{
  listing: Listing | null;
  usingSamples: boolean;
}> {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      listing: sampleListings.find((listing) => listing.id === id) ?? null,
      usingSamples: true,
    };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        owner: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { comments: true } },
      },
    });
    return { listing: item ? toListing(item) : null, usingSamples: false };
  } catch (error) {
    console.error("İlan okunamadı, örnek veriye bakılıyor.", error);
    return {
      listing: sampleListings.find((listing) => listing.id === id) ?? null,
      usingSamples: true,
    };
  }
}
