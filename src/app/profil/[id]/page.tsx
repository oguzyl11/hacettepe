import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ContactMethod } from "@prisma/client";
import { ProfileScreen } from "@/components/profile-screen";
import { getPublicProfile } from "@/lib/activity";
import { getServerDictionary } from "@/lib/i18n/server";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" />}>
        <PublicBody params={params} />
      </Suspense>
    </main>
  );
}

async function PublicBody({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [{ profile, unavailable }, { locale, t }] = await Promise.all([
    getPublicProfile(id),
    getServerDictionary(),
  ]);
  if (unavailable) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm">
        {t.catalog.unavailable}
      </p>
    );
  }
  if (!profile) notFound();
  const defaultName = locale === "tr" ? "Öğrenci" : "Student";

  return (
    <ProfileScreen
      name={profile.name?.trim() || defaultName}
      instagramHandle={profile.instagramHandle ?? ""}
      preferredContact={ContactMethod.EMAIL}
      image={profile.image}
      databaseReady
      ratingAverage={profile.ratingAverage}
      ratingCount={profile.ratingCount}
      soldCount={profile.soldCount}
      showEmail={false}
      posts={profile.items.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.images[0] ?? null,
        status: item.status,
      }))}
    />
  );
}
