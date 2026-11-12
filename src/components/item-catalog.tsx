import type { ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { ContactMethod } from "@prisma/client";
import { ItemCard } from "@/components/item-card";
import {
  categories,
  conditions,
  getCategoryLabel,
  getConditionLabel,
  getContactLabel,
  isContactMethod,
  isItemCategory,
  isItemCondition,
} from "@/lib/labels";
import { getListings } from "@/lib/listings";
import { getServerDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

type Query = {
  kategori?: string;
  durum?: string;
  iletisim?: string;
  q?: string;
};

export async function ItemCatalog({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const { locale, t } = await getServerDictionary();
  const params = await searchParams;
  const category =
    params.kategori && isItemCategory(params.kategori)
      ? params.kategori
      : undefined;
  const condition =
    params.durum && isItemCondition(params.durum) ? params.durum : undefined;
  const contact =
    params.iletisim && isContactMethod(params.iletisim)
      ? params.iletisim
      : undefined;
  const { listings } = await getListings({
    category,
    condition,
    contact,
    query: params.q,
  });

  const current = {
    kategori: category,
    durum: condition,
    iletisim: contact,
    q: params.q,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28">
        <p className="text-sm font-semibold">{t.catalog.filters}</p>
        <FilterGroup title={t.catalog.category}>
          <FilterLink
            href={href(current, { kategori: undefined })}
            active={!category}
          >
            {t.catalog.all}
          </FilterLink>
          {categories.map((item) => (
            <FilterLink
              key={item}
              href={href(current, { kategori: item })}
              active={category === item}
            >
              {getCategoryLabel(item, locale)}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title={t.catalog.condition}>
          <FilterLink
            href={href(current, { durum: undefined })}
            active={!condition}
          >
            {t.catalog.all}
          </FilterLink>
          {conditions.map((item) => (
            <FilterLink
              key={item}
              href={href(current, { durum: item })}
              active={condition === item}
            >
              {getConditionLabel(item, locale)}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title={t.catalog.contact}>
          <FilterLink
            href={href(current, { iletisim: undefined })}
            active={!contact}
          >
            {t.catalog.all}
          </FilterLink>
          {[ContactMethod.EMAIL, ContactMethod.INSTAGRAM].map((item) => (
            <FilterLink
              key={item}
              href={href(current, { iletisim: item })}
              active={contact === item}
            >
              {getContactLabel(item, locale)}
            </FilterLink>
          ))}
        </FilterGroup>
      </aside>
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {t.catalog.listingsCount.replace("{count}", String(listings.length))}
            </p>
            {params.q ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {t.catalog.searchResult.replace("{query}", params.q)}
                <Link
                  href={href(current, { q: undefined })}
                  className="rounded-full p-0.5 hover:bg-primary/20"
                  title={t.search.clearSearch}
                >
                  <X className="size-3" />
                </Link>
              </span>
            ) : null}
          </div>
        </div>
        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold">
              {params.q
                ? t.catalog.noSearchResults.replace("{query}", params.q)
                : t.catalog.noListings}
            </p>
            {params.q ? (
              <p className="mt-2 text-sm text-muted-foreground">
                <Link
                  href={href(current, { q: undefined })}
                  className="font-semibold text-primary hover:underline"
                >
                  {t.catalog.clearSearch}
                </Link>{" "}
                {t.catalog.orBrowseCategories}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ItemCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterLink({
  href: to,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={to}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        active
          ? "bg-primary text-white"
          : "bg-muted text-slate-600 hover:bg-slate-200"
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
