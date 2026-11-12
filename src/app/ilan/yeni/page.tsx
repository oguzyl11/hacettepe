import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/auth";
import { ListingForm } from "@/components/listing-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";
import { getServerDictionary } from "@/lib/i18n/server";

export default function NewListingPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Suspense
        fallback={<div className="h-96 animate-pulse rounded-3xl bg-muted" />}
      >
        <NewListingBody />
      </Suspense>
    </main>
  );
}

async function NewListingBody() {
  await connection();
  const [session, { t, locale }] = await Promise.all([
    auth(),
    getServerDictionary(),
  ]);

  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">
            {locale === "tr"
              ? "İlan vermek için giriş yap"
              : "Sign in to post a listing"}
          </h1>
        </CardHeader>
        <CardContent>
          <Link
            href="/giris?donus=/ilan/yeni"
            className="text-sm font-medium text-primary hover:underline"
          >
            {locale === "tr" ? "Giriş sayfasına git" : "Go to sign-in page"}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">
        {t.newListing.title}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold">
        {locale === "tr"
          ? "Yeni takas ilanı oluştur"
          : "Create a new barter listing"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {locale === "tr"
          ? "Başlık, kategori, durum, açıklama ve en fazla dört fotoğraf."
          : "Title, category, condition, description and up to four photos."}
      </p>
      <div className="mt-6">
        <ListingForm databaseReady={Boolean(getPrisma())} />
      </div>
    </div>
  );
}
