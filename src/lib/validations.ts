import { ContactMethod, ItemCategory, ItemCondition } from "@prisma/client";
import { z } from "zod";

export const insertItemSchema = z.object({
  title: z.string().trim().min(3, "Başlık en az 3 karakter olmalı.").max(80, "Başlık en fazla 80 karakter olabilir."),
  description: z
    .string()
    .trim()
    .min(10, "Açıklama en az 10 karakter olmalı.")
    .max(2000, "Açıklama en fazla 2000 karakter olabilir."),
  category: z.nativeEnum(ItemCategory, { invalid_type_error: "Kategori seç." }),
  condition: z.nativeEnum(ItemCondition, { invalid_type_error: "Durum seç." }),
});

export const commentSchema = z.object({
  text: z.string().trim().min(2, "Yorum en az 2 karakter olmalı.").max(1000, "Yorum en fazla 1000 karakter olabilir."),
});

export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Adın en az 2 karakter olmalı.").max(80, "Adın en fazla 80 karakter olabilir."),
    instagramHandle: z
      .string()
      .trim()
      .transform((value) => value.replace(/^@+/, "").toLowerCase())
      .refine((value) => value === "" || /^[a-z0-9._]{1,30}$/.test(value), "Instagram kullanıcı adı geçersiz."),
    preferredContact: z.nativeEnum(ContactMethod, { invalid_type_error: "İletişim yöntemini seç." }),
  })
  .superRefine((value, context) => {
    if (value.preferredContact === ContactMethod.INSTAGRAM && !value.instagramHandle) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["instagramHandle"],
        message: "Instagram’ı tercih ettiğinde kullanıcı adı gerekli.",
      });
    }
  });

export function validationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Bilgiler geçersiz.";
}
