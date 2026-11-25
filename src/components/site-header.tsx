import { Suspense } from "react";
import Link from "next/link";
import { Plus, Settings, UserRound } from "lucide-react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { SiteNav } from "@/components/site-nav";
import {
  SearchAutocomplete,
  MobileSearchToggle,
} from "@/components/search-autocomplete";
import { LanguageToggle } from "@/components/language-toggle";
import { TepeliMark, TepeliWordmark } from "@/components/tepeli-logo";
import { getServerDictionary } from "@/lib/i18n/server";

export async function SiteHeader() {
  const { t } = await getServerDictionary();

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-200">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-2 font-medium">
            <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
              {t.home.verifiedBadge}
            </span>
            <span className="truncate">{t.home.verifiedBar}</span>
          </p>
          <Link href="/#nasil" className="shrink-0 font-medium text-slate-300 hover:text-white">
            {t.home.howItWorks}
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <TepeliMark className="size-11" />
            <span className="flex flex-col leading-tight">
              <TepeliWordmark className="text-xl" />
              <span className="hidden text-[10px] font-semibold tracking-wider text-slate-400 uppercase xl:block">
                {t.common.siteTagline}
              </span>
            </span>
          </Link>
          <div className="hidden min-w-0 flex-1 md:block">
            <Suspense
              fallback={
                <div className="h-12 w-full animate-pulse rounded-full bg-slate-100" />
              }
            >
              <SearchAutocomplete />
            </Suspense>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Suspense fallback={null}>
              <MobileSearchToggle />
            </Suspense>
            <LanguageToggle />
            <Link
              href="/ilan/yeni"
              aria-label={t.common.nav.postFree}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 lg:px-4"
            >
              <Plus className="size-5" strokeWidth={2.5} />
              <span className="hidden lg:inline">{t.common.nav.postFree}</span>
            </Link>
            <Link
              href="/ayarlar"
              title={t.common.nav.settings}
              aria-label={t.common.nav.settings}
              className="grid size-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-50 hover:text-primary"
            >
              <Settings className="size-4" />
            </Link>
            <Suspense fallback={<div className="h-12 w-12 rounded-xl bg-slate-100" />}>
              <AccountChip />
            </Suspense>
          </div>
        </div>
        <SiteNav />
      </header>
    </>
  );
}

async function AccountChip() {
  await connection();
  const { t } = await getServerDictionary();
  const session = await auth();
  if (!session?.user) {
    return (
      <Link
        href="/giris"
        className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2"
      >
        <span className="grid size-8 place-items-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
          <UserRound className="size-4" />
        </span>
        <span className="hidden text-left lg:block">
          <span className="block text-xs leading-none font-bold text-slate-900">
            {t.common.nav.signIn}
          </span>
          <span className="mt-0.5 block text-[11px] text-slate-400">
            {t.common.studentAccount}
          </span>
        </span>
      </Link>
    );
  }
  const label = session.user.name?.trim() || t.common.nav.profile;
  return (
    <Link
      href="/profil"
      className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2"
    >
      <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-bold text-white">
        {label.slice(0, 1).toLocaleUpperCase("tr")}
      </span>
      <span className="hidden max-w-28 text-left lg:block">
        <span className="block truncate text-xs leading-none font-bold text-slate-900">
          {label}
        </span>
        <span className="mt-0.5 block text-[11px] text-slate-400">
          {t.common.nav.profile}
        </span>
      </span>
    </Link>
  );
}
