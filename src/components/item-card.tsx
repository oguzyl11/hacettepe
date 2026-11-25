import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ItemCondition } from "@prisma/client";
import { InstagramLink } from "@/components/instagram-link";
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
  soldLabel,
  scoreLabel,
}: {
  listing: Listing;
  locale?: Locale;
  soldLabel: string;
  scoreLabel: string;
}) {
  const score =
    listing.owner.ratingCount > 0
      ? scoreLabel.replace("{score}", listing.owner.ratingAverage.toFixed(1))
      : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link href={`/ilan/${listing.id}`} className="relative block">
        <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-muted p-3">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="(min-width: 1280px) 360px, 50vw"
              className="object-cover"
            />
          ) : null}
          <span className="relative rounded-full bg-card/90 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
            {getCategoryLabel(listing.category, locale)}
          </span>
        </div>
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2 py-1 text-[10px] font-bold",
            conditionTone[listing.condition],
          )}
        >
          {getConditionLabel(listing.condition, locale)}
        </span>
        {listing.status === "SOLD" ? (
          <span className="absolute top-3 right-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold text-white">
            {soldLabel}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/ilan/${listing.id}`}>
          <h2 className="font-display line-clamp-2 text-base font-semibold">{listing.title}</h2>
        </Link>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Beytepe
          {score ? <span className="ml-2 font-semibold text-foreground">{score}</span> : null}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`/profil/${listing.owner.id}`}
            className="truncate text-xs font-medium hover:text-primary"
          >
            {listing.owner.name}
          </Link>
          <InstagramLink
            handle={listing.owner.instagramHandle}
            label="Instagram"
            className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-white"
          />
        </div>
      </div>
    </article>
  );
}
