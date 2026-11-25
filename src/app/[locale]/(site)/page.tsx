import { Suspense } from "react";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/locale-link";
import { ArrowRight, BadgeCheck, BookOpen, Plus, ShieldCheck } from "lucide-react";
import { InstagramMark } from "@/components/instagram-mark";
import { ItemCatalog } from "@/components/item-catalog";
import { categories, getCategoryLabel, isItemCategory } from "@/lib/labels";
import { getRecentListings } from "@/lib/listings";
import { dictionaryFor } from "@/lib/i18n/server";
import { isLocale } from "@/lib/locale";
import type { Dictionary, Locale } from "@/lib/i18n/types";
import { formatDate } from "@/lib/utils";

const heroCategories = 4;

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    kategori?: string;
    durum?: string;
    q?: string;
    sayfa?: string;
  }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "tr";
  const { t } = dictionaryFor(locale);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 sm:px-6">
      <section className="grid items-stretch gap-4 pt-5 pb-2 md:grid-cols-12">
        <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-[#45090e]/40 bg-gradient-to-br from-[#800f18] via-[#a81c26] to-[#45090e] p-6 text-white shadow-md sm:p-8 md:col-span-8">
          <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-rose-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-5rem] left-1/3 size-80 rounded-full bg-amber-500/15 blur-3xl" />
          <p className="relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-black tracking-wide text-slate-950 uppercase">
            <BadgeCheck className="size-3.5" />
            {t.home.heroBadge}
          </p>
          <div className="relative z-10 my-4 max-w-xl">
            <h1 className="text-2xl font-extrabold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-rose-100/90 sm:text-sm">
              {t.home.heroDescription}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/#ilanlar"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-primary shadow-md sm:text-sm"
              >
                {t.home.browseListings}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/ilan/yeni"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-2.5 text-xs font-semibold backdrop-blur-sm sm:text-sm"
              >
                <Plus className="size-4" strokeWidth={2.5} />
                {t.home.postListing}
              </Link>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="relative z-10 grid grid-cols-2 gap-2 border-t border-white/15 pt-3 sm:grid-cols-4">
                {categories.slice(0, heroCategories).map((category) => (
                  <div key={category} className="h-8 rounded-lg bg-black/15" />
                ))}
              </div>
            }
          >
            <HeroCategories locale={locale} searchParams={searchParams} />
          </Suspense>
        </div>
        <Suspense fallback={<div className="min-h-[340px] rounded-2xl bg-white md:col-span-4" />}>
          <RecentShowcase locale={locale} t={t} />
        </Suspense>
      </section>

      <div id="ilanlar" className="py-6">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
          <ItemCatalog searchParams={searchParams} />
        </Suspense>
      </div>

      <section id="nasil" className="mt-8">
        <h2 className="text-center text-2xl font-bold">{t.home.howItWorks}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: t.home.step1Title,
              text: t.home.step1Desc,
            },
            {
              icon: BadgeCheck,
              title: t.home.step2Title,
              text: t.home.step2Desc,
            },
            {
              icon: InstagramMark,
              title: t.home.step3Title,
              text: t.home.step3Desc,
            },
          ].map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </span>
              <step.icon className="mt-3 size-5 text-secondary" />
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

async function HeroCategories({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ kategori?: string }>;
}) {
  const query = await searchParams;
  const activeCategory =
    query.kategori && isItemCategory(query.kategori) ? query.kategori : undefined;

  return (
    <div className="relative z-10 grid grid-cols-2 gap-2 border-t border-white/15 pt-3 text-[11px] sm:grid-cols-4">
      {categories.slice(0, heroCategories).map((category, index) => {
        const selected = activeCategory === category;
        return (
          <Link
            key={category}
            href={`/?kategori=${category}`}
            aria-current={selected ? "true" : undefined}
            className={
              selected
                ? "truncate rounded-lg border border-white/40 bg-white/25 p-1.5 font-bold text-white"
                : "truncate rounded-lg bg-black/15 p-1.5 text-white/80 hover:bg-white/10"
            }
          >
            {index + 1}. {getCategoryLabel(category, locale)}
          </Link>
        );
      })}
    </div>
  );
}

async function RecentShowcase({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const recent = await getRecentListings();

  return (
    <aside className="flex flex-col justify-between gap-3 md:col-span-4">
      <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <p className="text-xs font-bold tracking-tight text-slate-900">{t.home.recentTitle}</p>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-primary">
            {t.home.newBadge}
          </span>
        </div>
        {recent.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">{t.home.recentEmpty}</p>
        ) : (
          <div className="space-y-2.5 py-2.5">
            {recent.map((listing) => (
              <Link
                key={listing.id}
                href={`/ilan/${listing.id}`}
                className="group flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200/70 bg-slate-100">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-slate-800 group-hover:text-primary">
                    {listing.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                    {listing.description}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {getCategoryLabel(listing.category, locale)} · {t.common.location} ·{" "}
                    {formatDate(listing.createdAt, locale)}
                    {listing.status === "SOLD" ? ` · ${t.itemDetail.sold}` : ""}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link
          href="/#ilanlar"
          className="block pt-1 text-center text-[11px] font-bold text-primary hover:underline"
        >
          {t.home.seeAllListings}
        </Link>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-3.5 text-white shadow-sm">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary shadow-md">
          <ShieldCheck className="size-5 text-amber-300" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold">{t.home.verifiedTitle}</span>
          <span className="mt-0.5 block text-[11px] leading-tight text-slate-300">
            {t.home.verifiedText}
          </span>
        </span>
      </div>
    </aside>
  );
}
