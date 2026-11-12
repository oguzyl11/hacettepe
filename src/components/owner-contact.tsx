"use client";

import { InstagramMark } from "@/components/instagram-mark";
import type { ListingOwner } from "@/lib/listings";
import { useTranslation } from "@/lib/i18n/context";

export function OwnerContact({ owner }: { owner: ListingOwner }) {
  const { t, locale } = useTranslation();
  const handle = owner.instagramHandle;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        {owner.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={owner.image}
            alt=""
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-12 place-items-center rounded-full bg-[#efefef] text-sm font-semibold">
            {owner.name.slice(0, 1).toLocaleUpperCase("tr")}
          </span>
        )}
        <div>
          <p className="text-xs text-muted-foreground">{t.itemDetail.owner}</p>
          <p className="font-semibold">{owner.name}</p>
        </div>
      </div>
      {handle ? (
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <InstagramMark className="size-4" />
          @{handle}
        </a>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === "tr"
            ? "Bu ilanın Instagram hesabı yok."
            : "No Instagram account provided for this listing."}
        </p>
      )}
    </div>
  );
}
