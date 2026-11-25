import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthSecurityNote, SignInForm } from "@/components/sign-in-form";
import { TepeliLogo } from "@/components/tepeli-logo";
import { dictionaryFor } from "@/lib/i18n/server";
import { isLocale } from "@/lib/locale";
import { safeRedirectPath } from "@/lib/utils";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; donus?: string }>;
}) {
  const { locale: raw } = await params;
  const { t } = dictionaryFor(isLocale(raw) ? raw : "tr");

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-[#f8f9ff] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-5 shadow-xl md:p-8">
          <div className="mb-5 flex flex-col items-center text-center">
            <TepeliLogo markClassName="size-10" wordClassName="text-4xl" />
            <p className="mt-2 max-w-xs text-xs text-[#59413e]">{t.auth.tagline}</p>
          </div>
          <div className="mb-5 flex items-start gap-2 rounded-lg bg-[#dce9ff] p-3 shadow-sm">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#991b1b]" />
            <div className="text-left">
              <p className="text-xs font-semibold text-[#0b1c30]">{t.auth.secureTitle}</p>
              <p className="text-xs leading-snug text-[#59413e]">
                <SecureCopy text={t.auth.secureText} />
              </p>
            </div>
          </div>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-[#eff4ff]" />}>
            <SignInBody searchParams={searchParams} />
          </Suspense>
          <AuthSecurityNote />
        </div>
      </div>
    </main>
  );
}

function SecureCopy({ text }: { text: string }) {
  const token = "@hacettepe.edu.tr";
  const [before, after] = text.split(token);
  if (after === undefined) return text;
  return (
    <>
      {before}
      <strong className="font-semibold text-[#991b1b]">{token}</strong>
      {after}
    </>
  );
}

async function SignInBody({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; donus?: string }>;
}) {
  const params = await searchParams;
  return (
    <SignInForm
      callbackPath={safeRedirectPath(params.donus)}
      error={params.error}
      devLogin={
        process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_LOGIN === "true"
      }
    />
  );
}
