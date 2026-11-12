"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function SignInPrompt({
  title,
  next,
}: {
  title: string;
  next: string;
}) {
  const { locale } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <Link
        href={`/giris?donus=${next}`}
        className="mt-3 inline-block text-sm font-semibold text-primary hover:underline transition-colors"
      >
        {locale === "tr" ? "Giriş sayfasına git" : "Go to sign-in page"}
      </Link>
    </div>
  );
}
