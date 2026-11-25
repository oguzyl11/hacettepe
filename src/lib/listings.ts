import type { ContactMethod, ItemCategory, ItemCondition, ItemStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { isContactMethod, isItemCategory, isItemCondition } from "@/lib/labels";
import { logger } from "@/lib/logger";
import { toPublicOwner, type PublicOwner } from "@/lib/trade";

export const pageSize = 20;
const commentLimit = 50;
const fallbackName = "Öğrenci";

const ownerSelect = {
  id: true,
  name: true,
  image: true,
  instagramHandle: true,
  preferredContact: true,
  ratingAverage: true,
  ratingCount: true,
  soldCount: true,
} as const;

const listingOrder = [
  { status: "asc" as const },
  { owner: { soldCount: "desc" as const } },
  { owner: { ratingAverage: "desc" as const } },
  { createdAt: "desc" as const },
];

export type ListingComment = {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
};

export type ListingOwner = PublicOwner;

export type Listing = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  status: ItemStatus;
  buyerId: string | null;
  soldAt: string | null;
  ratingScore: number | null;
  images: string[];
  createdAt: string;
  commentCount: number;
  owner: ListingOwner;
  comments: ListingComment[];
};

export type ListingFilters = {
  category?: string;
  condition?: string;
  contact?: string;
  query?: string;
  page?: number;
};

export type ListingQuery = {
  listings: Listing[];
  total: number;
  page: number;
  pageCount: number;
  unavailable: boolean;
};

type OwnerRow = {
  id: string;
  name: string | null;
  image: string | null;
  instagramHandle: string | null;
  preferredContact: ContactMethod;
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
};

type CommentRow = {
  id: string;
  body: string;
  createdAt: Date;
  authorId: string;
  author: { id: string; name: string | null };
};

type ItemRow = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  status: ItemStatus;
  buyerId: string | null;
  soldAt: Date | null;
  images: string[];
  createdAt: Date;
  owner: OwnerRow;
  comments?: CommentRow[];
  rating?: { score: number } | null;
  _count?: { comments: number };
};

function toListing(item: ItemRow): Listing {
  const comments = (item.comments ?? []).map((comment) => ({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    authorId: comment.authorId,
    authorName: comment.author.name?.trim() || fallbackName,
  }));

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    condition: item.condition,
    status: item.status,
    buyerId: item.buyerId,
    soldAt: item.soldAt ? item.soldAt.toISOString() : null,
    ratingScore: item.rating?.score ?? null,
    images: item.images,
    createdAt: item.createdAt.toISOString(),
    commentCount: item._count?.comments ?? comments.length,
    owner: toPublicOwner(
      {
        ...item.owner,
        name: item.owner.name?.trim() || fallbackName,
      },
      fallbackName,
    ),
    comments,
  };
}

function normalizedFilters(filters: ListingFilters) {
  const category = filters.category && isItemCategory(filters.category) ? filters.category : undefined;
  const condition = filters.condition && isItemCondition(filters.condition) ? filters.condition : undefined;
  const contact = filters.contact && isContactMethod(filters.contact) ? filters.contact : undefined;
  const query = filters.query?.trim() || undefined;
  const page = Number.isFinite(filters.page) ? Math.max(1, Math.floor(filters.page ?? 1)) : 1;
  return { category, condition, contact, query, page };
}

function whereFor(filters: ReturnType<typeof normalizedFilters>) {
  return {
    category: filters.category,
    condition: filters.condition,
    owner: filters.contact ? { preferredContact: filters.contact } : undefined,
    OR: filters.query
      ? [
          { title: { contains: filters.query, mode: "insensitive" as const } },
          { description: { contains: filters.query, mode: "insensitive" as const } },
        ]
      : undefined,
  };
}

const emptyQuery = (page: number, unavailable: boolean): ListingQuery => ({
  listings: [],
  total: 0,
  page,
  pageCount: 1,
  unavailable,
});

export async function getListings(filters: ListingFilters = {}): Promise<ListingQuery> {
  const normalized = normalizedFilters(filters);
  const prisma = getPrisma();
  if (!prisma) return emptyQuery(normalized.page, true);

  try {
    const where = whereFor(normalized);
    const [total, items] = await prisma.$transaction([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          condition: true,
          status: true,
          buyerId: true,
          soldAt: true,
          images: true,
          createdAt: true,
          owner: { select: ownerSelect },
          _count: { select: { comments: true } },
        },
        orderBy: listingOrder,
        skip: (normalized.page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    return {
      listings: items.map((item) => toListing(item)),
      total,
      page: normalized.page,
      pageCount,
      unavailable: false,
    };
  } catch (error) {
    logger.error("listings.read", error);
    return emptyQuery(normalized.page, true);
  }
}

const recentCount = 3;

export async function getRecentListings(): Promise<Listing[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      take: recentCount,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        condition: true,
        status: true,
        buyerId: true,
        soldAt: true,
        images: true,
        createdAt: true,
        owner: { select: ownerSelect },
      },
    });
    return items.map((item) => toListing(item));
  } catch (error) {
    logger.error("listings.recent", error);
    return [];
  }
}

export async function getListing(id: string): Promise<{
  listing: Listing | null;
  unavailable: boolean;
}> {
  const prisma = getPrisma();
  if (!prisma) return { listing: null, unavailable: true };

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        condition: true,
        status: true,
        buyerId: true,
        soldAt: true,
        images: true,
        createdAt: true,
        owner: { select: ownerSelect },
        rating: { select: { score: true } },
        comments: {
          take: commentLimit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            body: true,
            createdAt: true,
            authorId: true,
            author: { select: { id: true, name: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });
    return { listing: item ? toListing(item) : null, unavailable: false };
  } catch (error) {
    logger.error("listing.read", error);
    return { listing: null, unavailable: true };
  }
}

export type SearchHit = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  image: string | null;
};

export async function searchListings(query: string, limit: number) {
  const take = Math.min(5, Math.max(1, limit));
  const trimmed = query.trim();
  const prisma = getPrisma();
  if (!prisma || !trimmed) return { hits: [] as SearchHit[], total: 0 };

  const where = {
    OR: [
      { title: { contains: trimmed, mode: "insensitive" as const } },
      { description: { contains: trimmed, mode: "insensitive" as const } },
    ],
  };
  const [total, rows] = await prisma.$transaction([
    prisma.item.count({ where }),
    prisma.item.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        condition: true,
        images: true,
      },
      orderBy: listingOrder,
      take,
    }),
  ]);
  return {
    total,
    hits: rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      condition: row.condition,
      image: row.images[0] ?? null,
    })),
  };
}
