"use client";

import { Suspense } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { categories, getCategoryLabel } from "@/lib/labels";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function SiteNav() {
  return (
    <Suspense fallback={<div className="h-11 border-t border-slate-100 bg-white" />}>
      <CategoryStrip />
    </Suspense>
  );
}

function CategoryStrip() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { locale, t } = useTranslation();
  const activeCategory = pathname === "/" ? params.get("kategori") : null;
  const myListings = pathname === "/ilanlarim";

  return (
    <nav className="overflow-x-auto border-t border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 px-4 py-2.5 text-xs font-medium whitespace-nowrap text-slate-600 sm:px-6">
        <Link
          href="/"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5",
            !activeCategory && pathname === "/"
              ? "bg-primary/10 font-bold text-primary"
              : "hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          <LayoutGrid className="size-3.5" />
          {t.home.allShowcase}
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/?kategori=${category}`}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5",
              activeCategory === category
                ? "bg-primary/10 font-bold text-primary"
                : "hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {getCategoryLabel(category, locale)}
          </Link>
        ))}
        <Link
          href="/ilanlarim"
          className={cn(
            "ml-auto shrink-0 rounded-lg px-3 py-1.5 font-semibold",
            myListings
              ? "bg-primary/10 text-primary"
              : "text-slate-700 hover:bg-slate-100",
          )}
        >
          {t.common.nav.myListings}
        </Link>
      </div>
    </nav>
  );
}
