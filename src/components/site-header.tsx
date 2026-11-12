import { Suspense } from "react";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import {
  SearchAutocomplete,
  MobileSearchToggle,
} from "@/components/search-autocomplete";
import { LanguageToggle } from "@/components/language-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
            H
          </span>
          <span className="font-display text-sm font-bold tracking-tight">
            Hacettepe Takas
          </span>
        </Link>
        <div className="hidden min-w-0 flex-1 max-w-xl md:block">
          <Suspense
            fallback={
              <div className="h-10 w-full animate-pulse rounded-full bg-muted/60" />
            }
          >
            <SearchAutocomplete />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={null}>
            <MobileSearchToggle />
          </Suspense>

          {/* Quick Language Switcher */}
          <LanguageToggle />

          <Button asChild size="sm">
            <Link href="/ilan/yeni">
              <Plus className="size-4" />
              <span className="hidden sm:inline">İlan Ekle</span>
            </Link>
          </Button>

          {/* Settings link */}
          <Link
            href="/ayarlar"
            title="Ayarlar / Settings"
            aria-label="Ayarlar / Settings"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="size-4" />
          </Link>

          <Suspense fallback={<div className="size-9 rounded-full bg-muted" />}>
            <AccountChip />
          </Suspense>
        </div>
      </div>
      <SiteNav />
    </header>
  );
}

async function AccountChip() {
  await connection();
  const session = await auth();
  if (!session?.user) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/giris">Giriş</Link>
      </Button>
    );
  }
  const label = session.user.name?.trim() || "Profil";
  return (
    <Link
      href="/profil"
      className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-muted transition-colors"
    >
      <span className="grid size-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-white">
        {label.slice(0, 1).toLocaleUpperCase("tr")}
      </span>
      <span className="hidden max-w-28 truncate text-xs font-semibold sm:block">
        {label}
      </span>
    </Link>
  );
}
