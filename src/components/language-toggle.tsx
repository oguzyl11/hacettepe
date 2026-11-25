"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { switchLocalePath } from "@/lib/locale";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/types";

export function LanguageToggle({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={cn("h-8 w-16 rounded-full bg-slate-100", className)} />}>
      <LanguageToggleInner className={className} />
    </Suspense>
  );
}

function LanguageToggleInner({ className }: { className?: string }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const { locale, t } = useTranslation();
  const query = search.toString();

  return (
    <nav aria-label={t.common.language} className={cn("inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-bold", className)}>
      <LanguageChoice current={locale} choice="tr" pathname={pathname} query={query} label="TR" />
      <LanguageChoice current={locale} choice="en" pathname={pathname} query={query} label="EN" />
    </nav>
  );
}

function LanguageChoice({
  current,
  choice,
  pathname,
  query,
  label,
}: {
  current: Locale;
  choice: Locale;
  pathname: string;
  query: string;
  label: string;
}) {
  const active = current === choice;
  return (
    <Link
      href={switchLocalePath(pathname, query, choice)}
      hrefLang={choice}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full px-2.5 py-1 tracking-wide",
        active ? "bg-[#991b1b] text-white" : "text-slate-500 hover:text-slate-900",
      )}
    >
      {label}
    </Link>
  );
}
