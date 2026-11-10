"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { authProviders, signIn } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { getPrisma } from "@/lib/prisma";
import { isHacettepeEmail, safeRedirectPath } from "@/lib/utils";

const devStudentEmail = "dev.ogrenci@hacettepe.edu.tr";

export async function signInWithGoogle(callbackPath: string) {
  if (!authProviders.google) {
    return {
      ok: false,
      message: "Google girişi henüz ayarlı değil.",
    } satisfies ActionState;
  }
  await signIn("google", { redirectTo: safeRedirectPath(callbackPath) });
}

export async function requestMagicLink(
  callbackPath: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  if (!isHacettepeEmail(email)) {
    return {
      ok: false,
      message: "Yalnızca @hacettepe.edu.tr adresleri giriş yapabilir.",
    };
  }
  if (!authProviders.email) {
    return {
      ok: false,
      message:
        "E-posta girişi henüz ayarlı değil. EMAIL_SERVER ve EMAIL_FROM ekle.",
    };
  }

  try {
    await signIn("nodemailer", {
      email: email.trim().toLowerCase(),
      redirectTo: safeRedirectPath(callbackPath),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        ok: false,
        message: "Giriş bağlantısı gönderilemedi. E-posta ayarını kontrol et.",
      };
    }
    throw error;
  }

  return {
    ok: true,
    message: "Bağlantı gönderildiyse gelen kutunu kontrol et.",
  };
}

export async function signInAsDevStudent(callbackPath: string) {
  if (process.env.NODE_ENV !== "development") {
    return {
      ok: false,
      message: "Bu giriş yalnızca yerel geliştirmede açık.",
    } satisfies ActionState;
  }

  const prisma = getPrisma();
  if (!prisma) {
    return {
      ok: false,
      message: "Veritabanı bağlı değil.",
    } satisfies ActionState;
  }

  const user = await prisma.user.upsert({
    where: { email: devStudentEmail },
    update: { name: "Geliştirme Öğrencisi", emailVerified: new Date() },
    create: {
      name: "Geliştirme Öğrencisi",
      email: devStudentEmail,
      emailVerified: new Date(),
    },
  });

  await prisma.item.upsert({
    where: { id: "dev-lamba" },
    update: { ownerId: user.id },
    create: {
      id: "dev-lamba",
      title: "Masa lambası",
      description: "Yurt odasında kullandım. Kitap veya küçük elektronikle takas olur.",
      category: "EV_ESYASI",
      condition: "AZ_KULLANILMIS",
      ownerId: user.id,
    },
  });

  const sessionToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await prisma.session.create({
    data: { sessionToken, userId: user.id, expires },
  });

  const cookieStore = await cookies();
  cookieStore.set("authjs.session-token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    expires,
  });

  redirect(safeRedirectPath(callbackPath));
}
