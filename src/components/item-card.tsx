import Link from "next/link";
import { MapPin } from "lucide-react";
import { ItemCondition } from "@prisma/client";
import { categoryLabel, conditionLabel } from "@/lib/labels";
import type { Listing } from "@/lib/listings";
import { cn } from "@/lib/utils";

const conditionTone: Record<ItemCondition, string> = {
  YENI_GIBI: "bg-emerald-600 text-white",
  AZ_KULLANILMIS: "bg-secondary text-white",
  ORTA_KULLANILMIS: "bg-amber-500 text-white",
  COK_KULLANILMIS: "bg-slate-600 text-white",
};

export function ItemCard({ listing }: { listing: Listing }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      <Link href={`/ilan/${listing.id}`} className="relative block">
        <div className="flex aspect-[4/3] items-end bg-gradient-to-br from-slate-200 to-slate-100 p-3">
          <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
            {categoryLabel[listing.category]}
          </span>
        </div>
        <span className={cn("absolute top-3 left-3 rounded-full px-2 py-1 text-[10px] font-bold", conditionTone[listing.condition])}>
          {conditionLabel[listing.condition]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/ilan/${listing.id}`}>
          <h2 className="font-display line-clamp-2 text-base font-semibold">{listing.title}</h2>
        </Link>
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Beytepe
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium">{listing.owner.name}</span>
          <Link
            href={`/ilan/${listing.id}?teklif=1`}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-[#991b1b]"
          >
            Takas Teklifi Yap
          </Link>
        </div>
      </div>
    </article>
  );
}
