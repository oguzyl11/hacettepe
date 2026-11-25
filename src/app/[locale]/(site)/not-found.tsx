"use client";

import { LocaleLink } from "@/components/locale-link";
import { useTranslation } from "@/lib/i18n/context";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center px-4 py-20">
      <h1 className="text-3xl font-semibold">{t.notFound.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.notFound.text}</p>
      <LocaleLink href="/" className="mt-6 text-sm font-medium text-primary">
        {t.notFound.home}
      </LocaleLink>
    </main>
  );
}
