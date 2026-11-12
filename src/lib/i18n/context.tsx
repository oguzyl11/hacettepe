"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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

  // Sync with cookies/localStorage on client mount if available
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
      if (match && (match[1] === "tr" || match[1] === "en")) {
        setLocaleState(match[1] as Locale);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      try {
        document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
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
