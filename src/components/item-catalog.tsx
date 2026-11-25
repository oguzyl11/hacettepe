import type { ReactNode } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { SlidersHorizontal, X } from "lucide-react";
import { ItemCard } from "@/components/item-card";
import {
  categories,
  conditions,
  getCategoryLabel,
  getConditionLabel,
  isItemCategory,
  isItemCondition,
} from "@/lib/labels";
import { getListings } from "@/lib/listings";
import { getServerDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

type Query = {
  kategori?: string;
  durum?: string;
  q?: string;
  sayfa?: string;
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
  const page = Math.max(1, Number.parseInt(params.sayfa ?? "1", 10) || 1);
  const { listings, total, pageCount, unavailable } = await getListings({
    category,
    condition,
    query: params.q,
    page,
  });

  const current = {
    kategori: category,
    durum: condition,
    q: params.q,
  };
  const filtered = Boolean(category || condition || params.q);

  return (
    <div className="grid items-start gap-6 md:grid-cols-4">
      <aside className="md:col-span-1">
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:sticky md:top-28">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900">
              <SlidersHorizontal className="size-4 text-primary" />
              {t.catalog.filters}
            </h2>
            {filtered ? (
              <Link
                href="/"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t.catalog.clearFilters}
              </Link>
            ) : null}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              {t.catalog.category}
            </p>
            <div className="space-y-0.5 text-xs">
              <FilterRow href={href(current, { kategori: undefined })} active={!category}>
                {t.catalog.all}
              </FilterRow>
              {categories.map((item) => (
                <FilterRow
                  key={item}
                  href={href(current, { kategori: item })}
                  active={category === item}
                >
                  {getCategoryLabel(item, locale)}
                </FilterRow>
              ))}
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              {t.catalog.condition}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FilterPill href={href(current, { durum: undefined })} active={!condition}>
                {t.catalog.all}
              </FilterPill>
              {conditions.map((item) => (
                <FilterPill
                  key={item}
                  href={href(current, { durum: item })}
                  active={condition === item}
                >
                  {getConditionLabel(item, locale)}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <section className="space-y-4 md:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900">{t.catalog.currentListings}</h2>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {t.catalog.listingsCount.replace("{count}", String(total))}
            </span>
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
        {unavailable ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold">{t.catalog.unavailable}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ItemCard
                key={listing.id}
                listing={listing}
                locale={locale}
                soldLabel={t.itemDetail.sold}
                scoreLabel={t.profile.score}
                locationLabel={t.common.location}
                reachLabel={t.catalog.reachInstagram}
                viewLabel={t.catalog.viewListing}
              />
            ))}
          </div>
        )}
        {pageCount > 1 ? (
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link
              href={pageHref(current, page - 1)}
              aria-disabled={page <= 1}
              className={cn(
                "rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold",
                page <= 1 && "pointer-events-none opacity-40",
              )}
            >
              {t.catalog.previous}
            </Link>
            <p className="text-muted-foreground">
              {t.catalog.pageStatus
                .replace("{page}", String(page))
                .replace("{pages}", String(pageCount))}
            </p>
            <Link
              href={pageHref(current, page + 1)}
              aria-disabled={page >= pageCount}
              className={cn(
                "rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold",
                page >= pageCount && "pointer-events-none opacity-40",
              )}
            >
              {t.catalog.next}
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function FilterRow({
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
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
        active
          ? "bg-primary/10 font-bold text-primary"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      {active ? <span className="size-1.5 rounded-full bg-primary" /> : null}
      {children}
    </Link>
  );
}

function FilterPill({
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
        "rounded-lg px-2.5 py-1.5 text-xs font-medium",
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200",
      )}
    >
      {children}
    </Link>
  );
}

function href(current: Query, patch: Partial<Query>) {
  return pageHref({ ...current, ...patch }, 1);
}

function pageHref(current: Query, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (key === "sayfa" || !value) continue;
    params.set(key, value);
  }
  if (page > 1) params.set("sayfa", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
