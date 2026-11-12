import { Suspense } from "react";
import Link from "next/link";
import { BadgeCheck, BookOpen } from "lucide-react";
import { InstagramMark } from "@/components/instagram-mark";
import { ItemCatalog } from "@/components/item-catalog";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    kategori?: string;
    durum?: string;
    iletisim?: string;
    q?: string;
  }>;
}) {
  const { t } = await getServerDictionary();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7f1212] to-[#b31b1b] text-white">
        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <BadgeCheck className="size-3.5" />
              {t.home.heroBadge}
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">
              {t.home.heroDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/#ilanlar"
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary"
              >
                {t.home.browseListings}
              </Link>
              <Link
                href="/ilan/yeni"
                className="rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold"
              >
                {t.home.postListing}
              </Link>
            </div>
          </div>
          <div className="hidden items-end justify-end md:flex">
            <div className="w-full max-w-sm rounded-xl bg-white/10 p-4 text-sm">
              {t.home.heroHint}
            </div>
          </div>
        </div>
      </section>

      <div id="ilanlar">
        <Suspense
          fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}
        >
          <ItemCatalog searchParams={searchParams} />
        </Suspense>
      </div>

      <section className="mt-14">
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
            <article
              key={step.title}
              className="rounded-xl border border-border bg-card p-4"
            >
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
