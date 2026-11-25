"use client";

import { LocaleLink as Link } from "@/components/locale-link";
import { LocaleSwitchLink } from "@/components/locale-switch-link";
import {
  Globe,
  Check,
  User,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { deleteAccount } from "@/app/actions/account";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function SettingsScreen({ userEmail }: { userEmail?: string | null }) {
  const { locale, t } = useLanguage();

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
          <LocaleSwitchLink
            locale="tr"
            className={cn(
              "relative flex items-center justify-between rounded-xl border p-4 text-left transition-all",
              locale === "tr"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                : "border-border bg-card hover:border-slate-300 hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                TR
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
          </LocaleSwitchLink>

          {/* English Option */}
          <LocaleSwitchLink
            locale="en"
            className={cn(
              "relative flex items-center justify-between rounded-xl border p-4 text-left transition-all",
              locale === "en"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                : "border-border bg-card hover:border-slate-300 hover:bg-muted/40"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary/10 text-xs font-bold text-secondary">
                EN
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
          </LocaleSwitchLink>
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
              {t.settings.verificationTitle}
            </p>
            <p className="mt-0.5">
              {t.settings.verificationText}
            </p>
          </div>
        </div>
      </section>

      {/* Back to Home Link */}
      {userEmail ? (
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">{t.settings.deleteAccount}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.settings.deleteAccountDesc}</p>
          <form action={deleteAccount} className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="confirm" value="yes" required />
              {t.settings.deleteConfirm}
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-white"
            >
              {t.settings.deleteAccount}
            </button>
          </form>
          <Link href="/gizlilik" className="mt-4 inline-block text-sm font-semibold text-primary">
            {t.settings.privacy}
          </Link>
        </section>
      ) : null}

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
