"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContactMethod } from "@prisma/client";
import { auth } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import {
  isContactMethod,
  isItemCategory,
  isItemCondition,
} from "@/lib/labels";
import { getPrisma } from "@/lib/prisma";
import { isHacettepeEmail } from "@/lib/utils";

async function currentStudent() {
  const session = await auth();
  const email = session?.user?.email;
  const id = session?.user?.id;
  if (!id || !isHacettepeEmail(email)) return null;
  return { id, email: email! };
}

function cleanInstagram(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export async function addComment(
  itemId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await currentStudent();
  if (!student) {
    return { ok: false, message: "Yorum için Hacettepe hesabınla giriş yap." };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return { ok: false, message: "Veritabanı bağlı değil." };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2 || body.length > 1000) {
    return { ok: false, message: "Yorum 2 ile 1000 karakter arasında olmalı." };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true },
    });
    if (!item) return { ok: false, message: "İlan bulunamadı." };

    await prisma.comment.create({
      data: { body, itemId, authorId: student.id },
    });
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Yorum kaydedilemedi. Veritabanı migrasyonunu kontrol et.",
    };
  }
  revalidatePath(`/ilan/${itemId}`);
  return { ok: true, message: "Yorumun eklendi." };
}

export async function createOffer(
  itemId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await currentStudent();
  if (!student) {
    return { ok: false, message: "Teklif için Hacettepe hesabınla giriş yap." };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return { ok: false, message: "Veritabanı bağlı değil." };
  }

  const note = String(formData.get("message") ?? "").trim();
  const offeredTitle = String(formData.get("offeredTitle") ?? "").trim();
  const message = [offeredTitle ? `Karşılık: ${offeredTitle}` : "", note]
    .filter(Boolean)
    .join("\n\n");
  if (message.length < 10 || message.length > 2000) {
    return {
      ok: false,
      message: "Teklif 10 ile 2000 karakter arasında olmalı.",
    };
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, ownerId: true },
    });
    if (!item) return { ok: false, message: "İlan bulunamadı." };
    if (item.ownerId === student.id) {
      return { ok: false, message: "Kendi ilanına teklif gönderemezsin." };
    }

    await prisma.offer.create({
      data: {
        message,
        itemId,
        senderId: student.id,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Teklif kaydedilemedi. Veritabanı migrasyonunu kontrol et.",
    };
  }
  revalidatePath(`/ilan/${itemId}`);
  return { ok: true, message: "Teklifin iletildi." };
}

export async function createItem(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await currentStudent();
  if (!student) {
    return { ok: false, message: "İlan vermek için giriş yap." };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return {
      ok: false,
      message: "Veritabanı bağlı değil. DATABASE_URL ekleyip migrasyonu çalıştır.",
    };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const condition = String(formData.get("condition") ?? "");

  if (title.length < 3 || title.length > 80) {
    return { ok: false, message: "Başlık 3 ile 80 karakter arasında olmalı." };
  }
  if (description.length < 10 || description.length > 2000) {
    return {
      ok: false,
      message: "Açıklama 10 ile 2000 karakter arasında olmalı.",
    };
  }
  if (!isItemCategory(category) || !isItemCondition(condition)) {
    return { ok: false, message: "Kategori ve durum seç." };
  }

  let itemId = "";
  try {
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        condition,
        images: [],
        ownerId: student.id,
      },
    });
    itemId = item.id;
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "İlan kaydedilemedi. Veritabanı migrasyonunu kontrol et.",
    };
  }
  revalidatePath("/");
  redirect(`/ilan/${itemId}`);
}

export async function updateProfile(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await currentStudent();
  if (!student) {
    return { ok: false, message: "Profil için giriş yap." };
  }
  const prisma = getPrisma();
  if (!prisma) {
    return { ok: false, message: "Veritabanı bağlı değil." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const instagramHandle = cleanInstagram(
    String(formData.get("instagramHandle") ?? ""),
  );
  const preferredContact = String(formData.get("preferredContact") ?? "");

  if (name.length < 2 || name.length > 80) {
    return { ok: false, message: "Adın 2 ile 80 karakter arasında olmalı." };
  }
  if (
    instagramHandle &&
    !/^[a-z0-9._]{1,30}$/.test(instagramHandle)
  ) {
    return { ok: false, message: "Instagram kullanıcı adı geçersiz." };
  }
  if (!isContactMethod(preferredContact)) {
    return { ok: false, message: "İletişim yöntemini seç." };
  }
  if (preferredContact === ContactMethod.INSTAGRAM && !instagramHandle) {
    return {
      ok: false,
      message: "Instagram’ı tercih ettiğinde kullanıcı adı gerekli.",
    };
  }

  try {
    await prisma.user.update({
      where: { id: student.id },
      data: {
        name,
        instagramHandle: instagramHandle || null,
        preferredContact,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Profil kaydedilemedi. Veritabanı migrasyonunu kontrol et.",
    };
  }
  revalidatePath("/profil");
  return { ok: true, message: "Profilin güncellendi." };
}
