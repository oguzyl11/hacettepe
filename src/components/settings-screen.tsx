"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Check,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function SettingsScreen({ userEmail }: { userEmail?: string | null }) {
  const { locale, setLocale, t } = useLanguage();
  const [justChanged, setJustChanged] = useState<string | null>(null);

  const handleSelectLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    setJustChanged(newLocale);
    setTimeout(() => {
      setJustChanged(null);
    }, 3000);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.settings.description}
        </p>
      </div>

      {justChanged && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800 border border-emerald-500/20 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>
            {locale === "tr"
              ? "Dil Türkçe olarak ayarlandı."
              : "Language set to English."}
          </span>
        </div>
      )}

      {/* Language Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Globe className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {t.settings.languageTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t.settings.languageDesc}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {/* Turkish Option */}
          <button
            type="button"
            onClick={() => handleSelectLanguage("tr")}
            className={cn(
              "relative flex items-center justify-between rounded-xl border p-4 text-left transition-all",
              locale === "tr"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                : "border-border bg-card hover:border-slate-300 hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="Türkçe">
                🇹🇷
              </span>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {t.settings.turkish}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.settings.turkishDesc}
                </p>
              </div>
            </div>
            {locale === "tr" && (
              <span className="grid size-6 place-items-center rounded-full bg-primary text-white">
                <Check className="size-3.5 stroke-[3]" />
              </span>
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => handleSelectLanguage("en")}
            className={cn(
              "relative flex items-center justify-between rounded-xl border p-4 text-left transition-all",
              locale === "en"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                : "border-border bg-card hover:border-slate-300 hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="English">
                🇬🇧
              </span>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {t.settings.english}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.settings.englishDesc}
                </p>
              </div>
            </div>
            {locale === "en" && (
              <span className="grid size-6 place-items-center rounded-full bg-primary text-white">
                <Check className="size-3.5 stroke-[3]" />
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Account & Profile Link */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-secondary/10 text-secondary">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {t.settings.accountTitle}
              </h2>
              <p className="text-xs text-muted-foreground">
                {userEmail
                  ? userEmail
                  : t.settings.accountDesc}
              </p>
            </div>
          </div>
          <Link
            href="/profil"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <span>{t.settings.goToProfile}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="rounded-2xl border border-border/80 bg-muted/40 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="size-5 text-institution-blue shrink-0 mt-0.5" />
          <div className="text-xs leading-5 text-muted-foreground">
            <p className="font-semibold text-foreground">
              {locale === "tr"
                ? "Hacettepe Üniversitesi Doğrulaması"
                : "Hacettepe University Verification"}
            </p>
            <p className="mt-0.5">
              {locale === "tr"
                ? "Platformdaki tüm işlemler yalnızca onaylanmış @hacettepe.edu.tr e-posta adresine sahip öğrenciler arasında gerçekleşir."
                : "All operations on the platform are conducted exclusively between students with verified @hacettepe.edu.tr email addresses."}
            </p>
          </div>
        </div>
      </section>

      {/* Back to Home Link */}
      <div className="pt-2 text-center">
        <Link
          href="/"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t.settings.backToHome}
        </Link>
      </div>
    </div>
  );
}
