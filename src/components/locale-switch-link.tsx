"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { switchLocalePath } from "@/lib/locale";
import type { Locale } from "@/lib/i18n/types";

export function LocaleSwitchLink({
  locale,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { locale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams();
  return (
    <Link
      href={switchLocalePath(pathname, search.toString(), locale)}
      hrefLang={locale}
      {...props}
    />
  );
}
