"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/language-toggle";
import { TepeliLogo } from "@/components/tepeli-logo";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <TepeliLogo markClassName="size-7" wordClassName="text-base" />
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t.footer.campusBarter}
          </p>
          <div className="mt-4">
            <LanguageToggle />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{t.footer.campuses}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Beytepe Merkez Kütüphane</li>
            <li>Mühendislik Fakültesi</li>
            <li>Sıhhiye Yerleşkesi</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">{t.footer.quickAccess}</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.footer.allListings}
              </Link>
            </li>
            <li>
              <Link
                href="/ilan/yeni"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.footer.shareListing}
              </Link>
            </li>
            <li>
              <Link
                href="/ilanlarim"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.common.nav.myListings}
              </Link>
            </li>
            <li>
              <Link
                href="/ayarlar"
                className="font-medium text-primary hover:text-foreground"
              >
                {t.settings.title}
              </Link>
            </li>
            <li>
              <Link href="/gizlilik" className="text-muted-foreground hover:text-foreground">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">{t.footer.verification}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t.footer.verificationText}
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl justify-between gap-4">
          <span>© 2026 {t.common.siteName}</span>
          <span>{t.footer.studentToStudent}</span>
        </div>
      </div>
    </footer>
  );
}
