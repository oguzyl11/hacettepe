"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

export function SiteNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: "/", label: t.common.nav.showcase },
    { href: "/ilan/yeni", label: t.common.nav.newListing },
    { href: "/ilanlarim", label: t.common.nav.myListings },
    { href: "/ayarlar", label: t.common.nav.settings },
  ];

  return (
    <nav className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              active
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
