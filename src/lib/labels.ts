import {
  ContactMethod,
  ItemCategory,
  ItemCondition,
} from "@prisma/client";

export const categoryLabel: Record<ItemCategory, string> = {
  KITAP: "Kitap",
  ELEKTRONIK: "Elektronik",
  GIYIM: "Giyim",
  EV_ESYASI: "Ev Eşyası",
  SPOR: "Spor",
  KIRTASIYE: "Kırtasiye",
  DIGER: "Diğer",
};

export const conditionLabel: Record<ItemCondition, string> = {
  AZ_KULLANILMIS: "Az Kullanılmış",
  ORTA_KULLANILMIS: "Orta Kullanılmış",
  COK_KULLANILMIS: "Çok Kullanılmış",
  YENI_GIBI: "Yeni Gibi",
};

export const contactLabel: Record<ContactMethod, string> = {
  EMAIL: "E-posta",
  INSTAGRAM: "Instagram",
};

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
