"use client";

import { LocaleLink as Link } from "@/components/locale-link";
import { signInHref } from "@/lib/locale";
import { useTranslation } from "@/lib/i18n/context";

export function SignInPrompt({
  title,
  next,
}: {
  title: string;
  next: string;
}) {
  const { locale, t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <Link
        href={signInHref(locale, next)}
        className="mt-3 inline-block text-sm font-semibold text-primary hover:underline transition-colors"
      >
        {t.common.goToSignIn}
      </Link>
    </div>
  );
}
