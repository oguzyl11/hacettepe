"use client";

import { useLanguage } from "@/lib/i18n/context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    const next = locale === "tr" ? "en" : "tr";
    setLocale(next);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={
        locale === "tr"
          ? "Switch to English (İngilizceye geç)"
          : "Türkçeye geç (Switch to Turkish)"
      }
      aria-label="Dil değiştir / Switch language"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs",
        className
      )}
    >
      <Globe className="size-3.5 text-muted-foreground" />
      <span className="font-bold tracking-wide">
        {locale === "tr" ? "TR" : "EN"}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {locale === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}
      </span>
    </button>
  );
}
