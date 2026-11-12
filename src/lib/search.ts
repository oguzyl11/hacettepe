import { ItemCategory, ItemCondition } from "@prisma/client";
import {
  categories,
  getCategoryLabel,
  getConditionLabel,
  categoryLabels,
} from "@/lib/labels";
import { getListings } from "@/lib/listings";
import type { Locale } from "@/lib/i18n/types";

export type AutocompleteListing = {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  condition: ItemCondition;
  conditionLabel: string;
  image: string | null;
  snippet: string;
};

export type AutocompleteCategory = {
  key: ItemCategory;
  label: string;
};

export type AutocompleteResult = {
  query: string;
  listings: AutocompleteListing[];
  categories: AutocompleteCategory[];
  totalMatches: number;
  popularSearches: string[];
};

export const POPULAR_SEARCHES_BY_LOCALE: Record<Locale, string[]> = {
  tr: [
    "Calculus",
    "Klavye",
    "Masa lambası",
    "Defter seti",
    "Palto",
    "Badminton",
  ],
  en: [
    "Calculus",
    "Keyboard",
    "Desk lamp",
    "Notebook set",
    "Coat",
    "Badminton",
  ],
};

export const POPULAR_SEARCHES = POPULAR_SEARCHES_BY_LOCALE.tr;

export async function getSearchSuggestions(
  query: string,
  limit = 5,
  locale: Locale = "tr"
): Promise<AutocompleteResult> {
  const trimmed = query.trim();
  const lowerQuery = trimmed.toLocaleLowerCase(locale === "tr" ? "tr" : "en");
  const popular = POPULAR_SEARCHES_BY_LOCALE[locale] || POPULAR_SEARCHES_BY_LOCALE.tr;

  if (!trimmed) {
    return {
      query: "",
      listings: [],
      categories: [],
      totalMatches: 0,
      popularSearches: popular,
    };
  }

  // Find matching categories (in both languages or chosen locale)
  const matchingCategories: AutocompleteCategory[] = categories
    .filter((cat) => {
      const trLabel = categoryLabels.tr[cat].toLocaleLowerCase("tr");
      const enLabel = categoryLabels.en[cat].toLowerCase();
      const key = cat.toLocaleLowerCase("tr");
      return (
        trLabel.includes(lowerQuery) ||
        enLabel.includes(lowerQuery) ||
        key.includes(lowerQuery)
      );
    })
    .slice(0, 3)
    .map((cat) => ({
      key: cat,
      label: getCategoryLabel(cat, locale),
    }));

  // Find matching listings
  const { listings } = await getListings({ query: trimmed });

  const mappedListings: AutocompleteListing[] = listings
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      categoryLabel: getCategoryLabel(item.category, locale),
      condition: item.condition,
      conditionLabel: getConditionLabel(item.condition, locale),
      image: item.images[0] || null,
      snippet:
        item.description.length > 70
          ? `${item.description.slice(0, 70)}...`
          : item.description,
    }));

  return {
    query: trimmed,
    listings: mappedListings,
    categories: matchingCategories,
    totalMatches: listings.length,
    popularSearches: popular,
  };
}
