import { headers } from "next/headers";
import { isLocale, localeHeader } from "@/lib/locale";
import type { Locale } from "./types";
import { dictionaries } from "./dictionaries";

export function dictionaryFor(locale: Locale) {
  return {
    locale,
    t: dictionaries[locale],
  };
}

export async function getServerLocale(): Promise<Locale> {
  const headerStore = await headers();
  const value = headerStore.get(localeHeader);
  return isLocale(value) ? value : "tr";
}

export async function getServerDictionary() {
  return dictionaryFor(await getServerLocale());
}
