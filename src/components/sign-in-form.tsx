"use client";

import { useActionState, useState } from "react";
import { requestMagicLink, signInAsDevStudent, signInWithGoogle } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyActionState } from "@/lib/action-state";
import { useTranslation } from "@/lib/i18n/context";

const errorCopyTr: Record<string, string> = {
  AccessDenied:
    "Bu hesapla giriş kapalı. Yalnızca @hacettepe.edu.tr adresleri kabul edilir.",
  Configuration:
    "Giriş sağlayıcısı eksik. Google veya e-posta ayarlarını kontrol et.",
  Verification:
    "Bağlantının süresi dolmuş veya daha önce kullanılmış. Yeniden iste.",
};

const errorCopyEn: Record<string, string> = {
  AccessDenied:
    "Sign-in restricted. Only @hacettepe.edu.tr addresses are accepted.",
  Configuration:
    "Sign-in provider missing. Check Google or email configuration.",
  Verification:
    "The link has expired or has already been used. Please request a new one.",
};

export function SignInForm({
  callbackPath,
  error,
  googleEnabled,
  emailEnabled,
  devLogin,
}: {
  callbackPath: string;
  error?: string;
  googleEnabled: boolean;
  emailEnabled: boolean;
  devLogin: boolean;
  locale?: string;
}) {
  const { t, locale } = useTranslation();
  const [state, action, pending] = useActionState(
    requestMagicLink.bind(null, callbackPath),
    emptyActionState
  );
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);

  const errorCopy = locale === "tr" ? errorCopyTr : errorCopyEn;

  return (
    <div className="space-y-6">
      {error && errorCopy[error] ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorCopy[error]}
        </p>
      ) : null}

      <form
        action={async () => {
          const result = await signInWithGoogle(callbackPath);
          setGoogleMessage(result?.message ?? null);
        }}
        className="space-y-3"
      >
        <Button type="submit" className="w-full" variant="outline">
          {locale === "tr" ? "Google ile devam et" : "Continue with Google"}
        </Button>
        {!googleEnabled ? (
          <p className="text-xs text-muted-foreground">
            {locale === "tr"
              ? "Google için AUTH_GOOGLE_ID ve AUTH_GOOGLE_SECRET ekle."
              : "Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET for Google sign-in."}
          </p>
        ) : null}
        {googleMessage ? (
          <p className="text-sm text-red-700">{googleMessage}</p>
        ) : null}
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {locale === "tr" ? "veya e-posta bağlantısı" : "or email link"}
        <span className="h-px flex-1 bg-border" />
      </div>

      {devLogin ? (
        <form
          action={async () => {
            await signInAsDevStudent(callbackPath);
          }}
        >
          <Button type="submit" className="w-full" variant="secondary">
            {locale === "tr"
              ? "Geliştirme hesabıyla gir"
              : "Sign in with Dev Account"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Yerel: dev.ogrenci@hacettepe.edu.tr (Dev only).
          </p>
        </form>
      ) : null}

      <form action={action} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">{t.auth.emailLabel}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ad.soyad@hacettepe.edu.tr"
          />
        </div>
        {state.message ? (
          <p
            className={
              state.success
                ? "text-sm text-emerald-700"
                : "text-sm text-red-700"
            }
          >
            {state.message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending
            ? t.common.saving
            : t.auth.sendLink}
        </Button>
        {!emailEnabled ? (
          <p className="text-xs text-muted-foreground">
            {locale === "tr"
              ? "Magic link için EMAIL_SERVER ve EMAIL_FROM ekle."
              : "Configure EMAIL_SERVER and EMAIL_FROM for magic links."}
          </p>
        ) : null}
      </form>
    </div>
  );
}
