import type { ReactNode } from "react";
import Link from "next/link";
import { ContactMethod } from "@prisma/client";
import { ItemCard } from "@/components/item-card";
import {
  categories,
  categoryLabel,
  conditions,
  conditionLabel,
  contactLabel,
  isContactMethod,
  isItemCategory,
  isItemCondition,
} from "@/lib/labels";
import { getListings } from "@/lib/listings";
import { cn } from "@/lib/utils";

type Query = {
  kategori?: string;
  durum?: string;
  iletisim?: string;
  q?: string;
};

export async function ItemCatalog({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const category = params.kategori && isItemCategory(params.kategori) ? params.kategori : undefined;
  const condition = params.durum && isItemCondition(params.durum) ? params.durum : undefined;
  const contact = params.iletisim && isContactMethod(params.iletisim) ? params.iletisim : undefined;
  const { listings } = await getListings({
    category,
    condition,
    contact,
    query: params.q,
  });

  const current = { kategori: category, durum: condition, iletisim: contact, q: params.q };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28">
        <p className="text-sm font-semibold">Filtreler</p>
        <FilterGroup title="Kategori">
          <FilterLink href={href(current, { kategori: undefined })} active={!category}>Tümü</FilterLink>
          {categories.map((item) => (
            <FilterLink key={item} href={href(current, { kategori: item })} active={category === item}>
              {categoryLabel[item]}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title="Durum">
          <FilterLink href={href(current, { durum: undefined })} active={!condition}>Tümü</FilterLink>
          {conditions.map((item) => (
            <FilterLink key={item} href={href(current, { durum: item })} active={condition === item}>
              {conditionLabel[item]}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title="İletişim">
          <FilterLink href={href(current, { iletisim: undefined })} active={!contact}>Tümü</FilterLink>
          {[ContactMethod.EMAIL, ContactMethod.INSTAGRAM].map((item) => (
            <FilterLink key={item} href={href(current, { iletisim: item })} active={contact === item}>
              {contactLabel[item]}
            </FilterLink>
          ))}
        </FilterGroup>
      </aside>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{listings.length} ilan</p>
        </div>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold">Bu süzgeçte ilan yok.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ItemCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterLink({ href: to, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={to}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        active ? "bg-primary text-white" : "bg-muted text-slate-600 hover:bg-slate-200",
      )}
    >
      {children}
    </Link>
  );
}

function href(current: Query, patch: Partial<Query>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
