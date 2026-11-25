import type { Locale } from "@/lib/i18n/types";

export const locales = ["tr", "en"] as const;
export const defaultLocale: Locale = "tr";
export const localeHeader = "x-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "tr" || value === "en";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en" || pathname === "/tr") return "/";
  if (pathname.startsWith("/en/") || pathname.startsWith("/tr/")) return pathname.slice(3);
  return pathname.length > 0 ? pathname : "/";
}

export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = beforeHash.indexOf("?");
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const bare = stripLocalePrefix(pathname);
  if (locale === defaultLocale) return `${bare}${query}${hash}`;
  const prefixed = bare === "/" ? "/en" : `/en${bare}`;
  return `${prefixed}${query}${hash}`;
}

export function switchLocalePath(pathname: string, query: string, locale: Locale): string {
  const bare = stripLocalePrefix(pathname);
  return localizePath(locale, `${bare}${query ? `?${query}` : ""}`);
}

export function signInHref(locale: Locale, next: string): string {
  const destination = localizePath(locale, next);
  return localizePath(locale, `/giris?donus=${encodeURIComponent(destination)}`);
}
