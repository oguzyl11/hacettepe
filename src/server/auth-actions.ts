"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { authProviders, signIn } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { isHacettepeEmail, safeRedirectPath } from "@/lib/utils";

const devStudentEmail = "dev.ogrenci@hacettepe.edu.tr";

export async function signInWithGoogle(callbackPath: string) {
  const { t } = await getServerDictionary();
  if (!authProviders.google) {
    return {
      success: false,
      message: t.errors.googleNotReady,
    } satisfies ActionState;
  }
  await signIn("google", { redirectTo: safeRedirectPath(callbackPath) });
}

export async function requestMagicLink(
  callbackPath: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { t } = await getServerDictionary();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isHacettepeEmail(email)) {
    return {
      success: false,
      message: t.errors.hacettepeOnly,
    };
  }
  if (!authProviders.email) {
    return {
      success: false,
      message: t.errors.emailNotReady,
    };
  }
  if (!rateLimit(`magic:${email}`, 5, 15 * 60 * 1000)) {
    return { success: false, message: t.errors.rateLimited };
  }

  try {
    await signIn("nodemailer", {
      email,
      redirectTo: safeRedirectPath(callbackPath),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: t.errors.magicLinkFailed,
      };
    }
    throw error;
  }

  return {
    success: true,
    message: t.errors.magicLinkSent,
  };
}

export async function signInAsDevStudent(callbackPath: string) {
  const { t } = await getServerDictionary();
  if (process.env.NODE_ENV !== "development" || process.env.ALLOW_DEV_LOGIN !== "true") {
    return {
      success: false,
      message: t.errors.devLoginClosed,
    } satisfies ActionState;
  }

  const prisma = getPrisma();
  if (!prisma) {
    return {
      success: false,
      message: t.errors.database,
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
