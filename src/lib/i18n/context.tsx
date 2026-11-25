"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Locale, Dictionary } from "./types";
import { dictionaries } from "./dictionaries";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
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
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      try {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax${secure}`;
        if (typeof window !== "undefined") {
          localStorage.setItem("locale", next);
        }
      } catch {
        // ignore
      }
      router.refresh();
    },
    [router]
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t: dictionaries[locale] || dictionaries.tr,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "tr" as Locale,
      setLocale: () => {},
      t: dictionaries.tr,
    };
  }
  return ctx;
}

export function useTranslation() {
  const { t, locale, setLocale } = useLanguage();
  return { t, locale, setLocale };
}
