import {
  ContactMethod,
  ItemCategory,
  ItemCondition,
} from "@prisma/client";
import type { Locale } from "@/lib/i18n/types";

export const categoryLabels: Record<Locale, Record<ItemCategory, string>> = {
  tr: {
    KITAP: "Kitap",
    ELEKTRONIK: "Elektronik",
    GIYIM: "Giyim",
    EV_ESYASI: "Ev Eşyası",
    SPOR: "Spor",
    KIRTASIYE: "Kırtasiye",
    DIGER: "Diğer",
  },
  en: {
    KITAP: "Books",
    ELEKTRONIK: "Electronics",
    GIYIM: "Clothing",
    EV_ESYASI: "Home & Living",
    SPOR: "Sports",
    KIRTASIYE: "Stationery",
    DIGER: "Other",
  },
};

export const conditionLabels: Record<Locale, Record<ItemCondition, string>> = {
  tr: {
    AZ_KULLANILMIS: "Az Kullanılmış",
    ORTA_KULLANILMIS: "Orta Kullanılmış",
    COK_KULLANILMIS: "Çok Kullanılmış",
    YENI_GIBI: "Yeni Gibi",
  },
  en: {
    AZ_KULLANILMIS: "Lightly Used",
    ORTA_KULLANILMIS: "Moderately Used",
    COK_KULLANILMIS: "Heavily Used",
    YENI_GIBI: "Like New",
  },
};

export const contactLabels: Record<Locale, Record<ContactMethod, string>> = {
  tr: {
    EMAIL: "E-posta",
    INSTAGRAM: "Instagram",
  },
  en: {
    EMAIL: "Email",
    INSTAGRAM: "Instagram",
  },
};

// Backwards-compatible aliases
export const categoryLabel: Record<ItemCategory, string> = categoryLabels.tr;
export const conditionLabel: Record<ItemCondition, string> = conditionLabels.tr;
export const contactLabel: Record<ContactMethod, string> = contactLabels.tr;

export function getCategoryLabel(category: ItemCategory, locale: Locale = "tr"): string {
  return categoryLabels[locale]?.[category] ?? categoryLabels.tr[category];
}

export function getConditionLabel(condition: ItemCondition, locale: Locale = "tr"): string {
  return conditionLabels[locale]?.[condition] ?? conditionLabels.tr[condition];
}

export function getContactLabel(contact: ContactMethod, locale: Locale = "tr"): string {
  return contactLabels[locale]?.[contact] ?? contactLabels.tr[contact];
}

export const categories = Object.values(ItemCategory);
export const conditions = Object.values(ItemCondition);

export function isItemCategory(value: string): value is ItemCategory {
  return categories.some((category) => category === value);
}

export function isItemCondition(value: string): value is ItemCondition {
  return conditions.some((condition) => condition === value);
}

export function isContactMethod(value: string): value is ContactMethod {
  return value === ContactMethod.EMAIL || value === ContactMethod.INSTAGRAM;
}
