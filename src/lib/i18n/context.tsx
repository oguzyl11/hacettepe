"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale, Dictionary } from "./types";
import { dictionaries } from "./dictionaries";

type LanguageContextValue = {
  locale: Locale;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale = "tr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const value = useMemo<LanguageContextValue>(
    () => ({
      locale: initialLocale,
      t: dictionaries[initialLocale],
    }),
    [initialLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "tr" as Locale,
      t: dictionaries.tr,
    };
  }
  return ctx;
}

export function useTranslation() {
  return useLanguage();
}
