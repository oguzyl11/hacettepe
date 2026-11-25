import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n/context";
import { dictionaryFor } from "@/lib/i18n/server";
import { isLocale } from "@/lib/locale";
import { assertProductionSecret } from "@/lib/secrets";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tepeli",
  description:
    "Tepeli, Hacettepe öğrencileri için kampüs içi takas platformu. Campus barter for Hacettepe students.",
  icons: { icon: "/tepeli-mark.svg" },
};

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  assertProductionSecret();
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const { locale } = dictionaryFor(raw);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
