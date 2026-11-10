import { Suspense } from "react";
import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
            H
          </span>
          <span className="font-display text-sm font-bold tracking-tight">
            Hacettepe Takas
          </span>
        </Link>
        <form action="/" className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            placeholder="Kampüste ne arıyorsun?"
            className="h-10 w-full rounded-full border border-border bg-muted/60 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/ilan/yeni">
              <Plus className="size-4" />
              İlan Ekle
            </Link>
          </Button>
          <span className="grid size-10 place-items-center rounded-full text-muted-foreground">
            <Bell className="size-4" />
          </span>
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
    <Link href="/profil" className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
      <span className="grid size-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-white">
        {label.slice(0, 1).toLocaleUpperCase("tr")}
      </span>
      <span className="hidden max-w-28 truncate text-xs font-semibold sm:block">{label}</span>
    </Link>
  );
}
