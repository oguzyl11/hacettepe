import { cookies } from "next/headers";
import type { Locale, Dictionary } from "./types";
import { dictionaries } from "./dictionaries";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get("locale")?.value;
    if (val === "en" || val === "tr") {
      return val;
    }
  } catch {
    // ignore
  }
  return "tr";
}

export async function getServerDictionary(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getServerLocale();
  return {
    locale,
    t: dictionaries[locale] || dictionaries.tr,
  };
}
