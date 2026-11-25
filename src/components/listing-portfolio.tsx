import Image from "next/image";
import { LocaleLink as Link } from "@/components/locale-link";
import type { ItemStatus } from "@prisma/client";

export type PortfolioItem = {
  id: string;
  title: string;
  image: string | null;
  status: ItemStatus;
};

export function ListingPortfolio({
  items,
  soldLabel,
  emptyLabel,
}: {
  items: PortfolioItem[];
  soldLabel: string;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <Link href={`/ilan/${item.id}`} className="relative block aspect-[4/3] bg-muted">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover"
              />
            ) : null}
            {item.status === "SOLD" ? (
              <span className="absolute top-3 right-3 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-white">
                {soldLabel}
              </span>
            ) : null}
          </Link>
          <div className="p-4">
            <h2 className="font-display line-clamp-2 text-base font-semibold">
              <Link href={`/ilan/${item.id}`} className="hover:text-primary">
                {item.title}
              </Link>
            </h2>
          </div>
        </article>
      ))}
    </div>
  );
}
