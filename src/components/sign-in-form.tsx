"use client";

import { useActionState, useState } from "react";
import { requestMagicLink, signInAsDevStudent, signInWithGoogle } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyActionState } from "@/lib/action-state";

const errorCopy: Record<string, string> = {
  AccessDenied:
    "Bu hesapla giriş kapalı. Yalnızca @hacettepe.edu.tr adresleri kabul edilir.",
  Configuration:
    "Giriş sağlayıcısı eksik. Google veya e-posta ayarlarını kontrol et.",
  Verification:
    "Bağlantının süresi dolmuş veya daha önce kullanılmış. Yeniden iste.",
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
}) {
  const [state, action, pending] = useActionState(
    requestMagicLink.bind(null, callbackPath),
    emptyActionState,
  );
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);

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
          Google ile devam et
        </Button>
        {!googleEnabled ? (
          <p className="text-xs text-muted-foreground">
            Google için AUTH_GOOGLE_ID ve AUTH_GOOGLE_SECRET ekle.
          </p>
        ) : null}
        {googleMessage ? (
          <p className="text-sm text-red-700">{googleMessage}</p>
        ) : null}
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        veya e-posta bağlantısı
        <span className="h-px flex-1 bg-border" />
      </div>

      {devLogin ? (
        <form
          action={async () => {
            await signInAsDevStudent(callbackPath);
          }}
        >
          <Button type="submit" className="w-full" variant="secondary">
            Geliştirme hesabıyla gir
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Yerel oturum: dev.ogrenci@hacettepe.edu.tr. Bu düğme yalnızca geliştirme sunucusunda görünür.
          </p>
        </form>
      ) : null}

      <form action={action} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">Hacettepe e-postası</Label>
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
              state.success ? "text-sm text-emerald-700" : "text-sm text-red-700"
            }
          >
            {state.message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Gönderiliyor" : "Giriş bağlantısı gönder"}
        </Button>
        {!emailEnabled ? (
          <p className="text-xs text-muted-foreground">
            Magic link için EMAIL_SERVER ve EMAIL_FROM ekle.
          </p>
        ) : null}
      </form>
    </div>
  );
}
