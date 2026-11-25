import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/i18n/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isHacettepeEmail(email: string | null | undefined) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  return at > 0 && normalized.slice(at + 1) === "hacettepe.edu.tr";
}

export function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) {
    return "/";
  }
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = beforeHash.indexOf("?");
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  let pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  if (pathname === "/tr") pathname = "/";
  else if (pathname.startsWith("/tr/")) pathname = pathname.slice(3);
  return `${pathname}${query}${hash}`;
}

export function formatDate(iso: string, locale: Locale = "tr") {
  const tag = locale === "en" ? "en-GB" : "tr-TR";
  return new Intl.DateTimeFormat(tag, { dateStyle: "medium" }).format(new Date(iso));
}
