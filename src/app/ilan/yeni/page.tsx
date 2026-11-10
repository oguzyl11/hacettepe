import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/auth";
import { ListingForm } from "@/components/listing-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

export default function NewListingPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-muted" />}>
        <NewListingBody />
      </Suspense>
    </main>
  );
}

async function NewListingBody() {
  await connection();
  const session = await auth();
  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">İlan vermek için giriş yap</h1>
        </CardHeader>
        <CardContent>
          <Link href="/giris?donus=/ilan/yeni" className="text-sm font-medium text-primary">
            Giriş sayfasına git
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">Yeni ilan</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Yeni takas ilanı oluştur</h1>
      <p className="mt-2 text-sm text-muted-foreground">Başlık, kategori, durum ve açıklama yeter. Fotoğraf alanı Blob için hazır.</p>
      <div className="mt-6">
        <ListingForm databaseReady={Boolean(getPrisma())} />
      </div>
    </div>
  );
}
