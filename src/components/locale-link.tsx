"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "@/lib/locale";
import { useTranslation } from "@/lib/i18n/context";

export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useTranslation();
  const localized = typeof href === "string" ? localizePath(locale, href) : href;
  return <Link href={localized} {...props} />;
}
