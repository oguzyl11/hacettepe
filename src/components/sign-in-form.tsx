"use client";

import { useActionState, useState, type ReactNode } from "react";
import {
  ArrowRight,
  AtSign,
  Badge,
  Building2,
  ChevronDown,
  GraduationCap,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { requestMagicLink, signInAsDevStudent, signInWithGoogle } from "@/server/auth-actions";
import { emptyActionState } from "@/lib/action-state";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const devStudentEmail = "dev.ogrenci@hacettepe.edu.tr";

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

const fieldClass =
  "h-11 w-full rounded-lg bg-white pr-3 pl-10 text-sm text-[#0b1c30] shadow-sm outline-none placeholder:text-[#8d706d] focus:ring-2 focus:ring-[#991b1b]";

export function SignInForm({
  callbackPath,
  error,
  devLogin,
}: {
  callbackPath: string;
  error?: string;
  devLogin: boolean;
}) {
  const { t, locale } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [state, action, pending] = useActionState(
    requestMagicLink.bind(null, callbackPath),
    emptyActionState,
  );
  const [googleMessage, setGoogleMessage] = useState<string | null>(null);
  const errorCopy = locale === "tr" ? errorCopyTr : errorCopyEn;
  const campuses = [
    t.auth.campusBeytepe,
    t.auth.campusSihhiye,
    t.auth.campusPolatli,
  ];
  const faculties = [
    t.auth.facultyEngineering,
    t.auth.facultyMedicine,
    t.auth.facultyLetters,
    t.auth.facultyEconomics,
    t.auth.facultyEducation,
    t.auth.facultyScience,
    t.auth.facultyDentistry,
    t.auth.facultyOther,
  ];

  return (
    <div>
      {error && errorCopy[error] ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorCopy[error]}
        </p>
      ) : null}

      <div className="mb-5 grid grid-cols-2 rounded-lg bg-[#e5eeff] p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={cn(
            "rounded-lg py-2 text-sm font-semibold transition-all",
            tab === "login"
              ? "bg-white text-[#760009] shadow-sm"
              : "text-[#59413e] hover:text-[#0b1c30]",
          )}
        >
          {t.auth.tabLogin}
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={cn(
            "rounded-lg py-2 text-sm font-semibold transition-all",
            tab === "register"
              ? "bg-white text-[#760009] shadow-sm"
              : "text-[#59413e] hover:text-[#0b1c30]",
          )}
        >
          {t.auth.tabRegister}
        </button>
      </div>

      {tab === "login" ? (
        <div className="flex flex-col">
          <form
            action={async () => {
              const result = await signInWithGoogle(callbackPath);
              setGoogleMessage(result?.message ?? null);
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg bg-[#eff4ff] px-3 py-3 text-sm font-semibold text-[#0b1c30] shadow-sm transition-colors hover:bg-[#e5eeff]"
            >
              <GoogleMark />
              <span>{t.auth.googleContinue}</span>
              <span className="ml-auto hidden rounded bg-[#ffdcc3] px-1.5 py-0.5 text-[11px] font-semibold text-[#fe932c] sm:inline">
                {t.auth.eduMail}
              </span>
            </button>
          </form>
          {googleMessage ? (
            <p className="mt-2 text-sm text-red-700">{googleMessage}</p>
          ) : null}

          <div className="relative my-5 flex items-center justify-center">
            <div className="h-px w-full bg-[#d3e4fe]" />
            <span className="absolute bg-white px-3 text-xs text-[#59413e]">
              {t.auth.orEmailLink}
            </span>
          </div>

          {devLogin ? (
            <form
              action={async () => {
                await signInAsDevStudent(callbackPath);
              }}
              className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-[#cce5ff] p-2 shadow-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Terminal className="size-5 shrink-0 text-[#003a5b]" />
                <span className="min-w-0">
                  <span className="block text-[11px] leading-tight font-bold text-[#001d31]">
                    {t.auth.devQuick}
                  </span>
                  <span className="block truncate text-xs leading-tight text-[#003a5b]">
                    {devStudentEmail}
                  </span>
                </span>
              </span>
              <button
                type="submit"
                className="shrink-0 rounded bg-[#003a5b] px-2 py-1 text-[11px] font-semibold text-white shadow-sm"
              >
                {t.auth.devUse}
              </button>
            </form>
          ) : null}

          <form action={action} className="flex flex-col gap-3">
            <EmailFields
              id="login-email"
              label={t.auth.emailLabel}
              hint={t.auth.passwordless}
              help={t.auth.magicHint}
            />
            <StatusMessage state={state} />
            <SubmitButton pending={pending} label={pending ? t.common.saving : t.auth.sendMagic}>
              <Send className="size-4" />
            </SubmitButton>
          </form>
        </div>
      ) : (
        <form action={action} className="flex flex-col gap-3">
          <Field label={t.auth.fullName} icon={<Badge className="size-4" />} htmlFor="reg-name">
            <input
              id="reg-name"
              name="name"
              required
              autoComplete="name"
              placeholder={t.auth.fullNamePlaceholder}
              className={fieldClass}
            />
          </Field>
          <EmailFields id="reg-email" label={t.auth.studentEmail} icon={<GraduationCap className="size-4" />} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label={t.auth.campus} icon={<MapPin className="size-4" />} htmlFor="reg-campus">
              <select id="reg-campus" name="campus" required className={cn(fieldClass, "appearance-none pr-8")}>
                {campuses.map((campus) => (
                  <option key={campus}>{campus}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-[#59413e]" />
            </Field>
            <Field label={t.auth.faculty} icon={<Building2 className="size-4" />} htmlFor="reg-faculty">
              <select id="reg-faculty" name="faculty" required className={cn(fieldClass, "appearance-none pr-8")}>
                {faculties.map((faculty) => (
                  <option key={faculty}>{faculty}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-[#59413e]" />
            </Field>
          </div>
          <Field
            label={t.auth.instagram}
            hint={t.auth.optional}
            icon={<AtSign className="size-4" />}
            htmlFor="reg-social"
          >
            <input
              id="reg-social"
              name="instagram"
              placeholder={t.auth.instagramPlaceholder}
              className={fieldClass}
            />
          </Field>
          <label className="flex items-start gap-2 rounded-lg bg-[#eff4ff] p-2 text-xs text-[#59413e]">
            <input
              type="checkbox"
              required
              className="mt-0.5 accent-[#991b1b]"
            />
            <span>{t.auth.terms}</span>
          </label>
          <StatusMessage state={state} />
          <SubmitButton pending={pending} label={pending ? t.common.saving : t.auth.startProfile}>
            <ArrowRight className="size-4" />
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

function EmailFields({
  id,
  label,
  hint,
  help,
  icon,
}: {
  id: string;
  label: string;
  hint?: string;
  help?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-sm font-semibold text-[#0b1c30]">
        <label htmlFor={id}>{label}</label>
        {hint ? <span className="text-[11px] font-semibold text-[#991b1b]">{hint}</span> : null}
      </span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-[#59413e]">
          {icon ?? <Mail className="size-4" />}
        </span>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ad.soyad@hacettepe.edu.tr"
          className={fieldClass}
        />
      </span>
      {help ? <p className="text-xs text-[#59413e]">{help}</p> : null}
    </div>
  );
}

function Field({
  label,
  hint,
  icon,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  icon: ReactNode;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center justify-between text-sm font-semibold text-[#0b1c30]">
        <label htmlFor={htmlFor}>{label}</label>
        {hint ? <span className="text-[11px] text-[#59413e]">{hint}</span> : null}
      </span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-[#59413e]">{icon}</span>
        {children}
      </span>
    </div>
  );
}

function StatusMessage({
  state,
}: {
  state: { success: boolean; message: string };
}) {
  if (!state.message) return null;
  return (
    <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-700"}>
      {state.message}
    </p>
  );
}

function SubmitButton({
  pending,
  label,
  children,
}: {
  pending: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
    >
      <span>{label}</span>
      {children}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthSecurityNote() {
  const { t } = useTranslation();
  return (
    <div className="mt-5 flex flex-col gap-1 rounded-lg bg-[#eff4ff] p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-[#904d00]">
        <ShieldCheck className="size-4" />
        {t.auth.whyTitle}
      </p>
      <p className="text-xs leading-relaxed text-[#59413e]">{t.auth.whyText}</p>
    </div>
  );
}
