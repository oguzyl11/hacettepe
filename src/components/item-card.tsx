import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ItemCondition } from "@prisma/client";
import { InstagramLink } from "@/components/instagram-link";
import { getCategoryLabel, getConditionLabel } from "@/lib/labels";
import type { Listing } from "@/lib/listings";
import type { Locale } from "@/lib/i18n/types";
import { cn, formatDate } from "@/lib/utils";

const conditionTone: Record<ItemCondition, string> = {
  YENI_GIBI: "bg-emerald-700 text-white",
  AZ_KULLANILMIS: "bg-blue-900/90 text-white",
  ORTA_KULLANILMIS: "bg-amber-600 text-white",
  COK_KULLANILMIS: "bg-slate-700 text-white",
};

export function ItemCard({
  listing,
  locale = "tr",
  soldLabel,
  scoreLabel,
  locationLabel,
  reachLabel,
  viewLabel,
}: {
  listing: Listing;
  locale?: Locale;
  soldLabel: string;
  scoreLabel: string;
  locationLabel: string;
  reachLabel: string;
  viewLabel: string;
}) {
  const score =
    listing.owner.ratingCount > 0
      ? scoreLabel.replace("{score}", listing.owner.ratingAverage.toFixed(1))
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/ilan/${listing.id}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
        <span
          className={cn(
            "absolute top-3 left-3 rounded-md px-2.5 py-1 text-[11px] font-bold shadow-sm",
            conditionTone[listing.condition],
          )}
        >
          {getConditionLabel(listing.condition, locale)}
        </span>
        {listing.status === "SOLD" ? (
          <span className="absolute top-3 right-3 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {soldLabel}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-400">
            <span className="rounded bg-primary/10 px-2 py-0.5 font-bold tracking-wider text-primary uppercase">
              {getCategoryLabel(listing.category, locale)}
            </span>
            <span className="shrink-0">{formatDate(listing.createdAt)}</span>
          </div>
          <Link href={`/ilan/${listing.id}`}>
            <h2 className="line-clamp-1 text-sm font-bold text-slate-900 transition-colors group-hover:text-primary">
              {listing.title}
            </h2>
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{listing.description}</p>
          {score ? (
            <p className="mt-2 text-xs font-semibold text-slate-700">{score}</p>
          ) : null}
        </div>
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="size-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{locationLabel}</span>
            </span>
            <Link
              href={`/profil/${listing.owner.id}`}
              className="max-w-[45%] truncate text-[11px] font-medium text-slate-600 hover:text-primary"
            >
              {listing.owner.name}
            </Link>
          </div>
          {listing.owner.instagramHandle ? (
            <InstagramLink
              handle={listing.owner.instagramHandle}
              label={reachLabel}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary"
            />
          ) : (
            <Link
              href={`/ilan/${listing.id}`}
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary"
            >
              {viewLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
