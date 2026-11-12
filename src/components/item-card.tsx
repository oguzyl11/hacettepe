import Link from "next/link";
import { MapPin } from "lucide-react";
import { InstagramMark } from "@/components/instagram-mark";
import { ItemCondition } from "@prisma/client";
import { getCategoryLabel, getConditionLabel } from "@/lib/labels";
import type { Listing } from "@/lib/listings";
import type { Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const conditionTone: Record<ItemCondition, string> = {
  YENI_GIBI: "bg-emerald-600 text-white",
  AZ_KULLANILMIS: "bg-secondary text-white",
  ORTA_KULLANILMIS: "bg-amber-500 text-white",
  COK_KULLANILMIS: "bg-slate-600 text-white",
};

export function ItemCard({
  listing,
  locale = "tr",
}: {
  listing: Listing;
  locale?: Locale;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      <Link href={`/ilan/${listing.id}`} className="relative block">
        <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 p-3">
          {listing.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.images[0]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <span className="relative rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
            {getCategoryLabel(listing.category, locale)}
          </span>
        </div>
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2 py-1 text-[10px] font-bold",
            conditionTone[listing.condition]
          )}
        >
          {getConditionLabel(listing.condition, locale)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/ilan/${listing.id}`}>
          <h2 className="font-display line-clamp-2 text-base font-semibold">
            {listing.title}
          </h2>
        </Link>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Beytepe
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium">
            {listing.owner.name}
          </span>
          {listing.owner.instagramHandle ? (
            <a
              href={`https://instagram.com/${listing.owner.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-white"
            >
              <InstagramMark className="size-3.5" />
              Instagram
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
