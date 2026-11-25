import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dictionaryFor } from "@/lib/i18n/server";
import { isLocale } from "@/lib/locale";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const { t } = dictionaryFor(isLocale(raw) ? raw : "tr");

  return (
    <>
      <SiteHeader t={t} />
      {children}
      <SiteFooter />
    </>
  );
}
