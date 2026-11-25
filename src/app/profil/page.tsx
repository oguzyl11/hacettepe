import { Suspense } from "react";
import { connection } from "next/server";
import { ContactMethod } from "@prisma/client";
import { ProfileScreen } from "@/components/profile-screen";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getMyListings } from "@/lib/activity";
import { currentStudent } from "@/lib/current-student";
import { getServerDictionary } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";
import { getPrisma } from "@/lib/prisma";

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" />}>
        <ProfileBody />
      </Suspense>
    </main>
  );
}

async function ProfileBody() {
  await connection();
  const [student, { locale, t }] = await Promise.all([
    currentStudent(),
    getServerDictionary(),
  ]);

  if (!student) {
    return <SignInPrompt title={t.profile.signInForProfile} next="/profil" />;
  }

  const prisma = getPrisma();
  let user = null;
  if (prisma) {
    try {
      user = await prisma.user.findUnique({
        where: { id: student.id },
        select: {
          name: true,
          image: true,
          instagramHandle: true,
          preferredContact: true,
          ratingAverage: true,
          ratingCount: true,
          soldCount: true,
        },
      });
    } catch (error) {
      logger.error("profile.self", error);
    }
  }

  const { items, unavailable } = await getMyListings(student.id);
  const defaultName = locale === "tr" ? "Öğrenci" : "Student";

  return (
    <div className="space-y-4">
      {unavailable ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {t.catalog.unavailable}
        </p>
      ) : null}
      <ProfileScreen
        name={user?.name ?? defaultName}
        email={student.email}
        instagramHandle={user?.instagramHandle ?? ""}
        preferredContact={user?.preferredContact ?? ContactMethod.EMAIL}
        image={user?.image ?? null}
        databaseReady={Boolean(user)}
        ratingAverage={user?.ratingAverage ?? 0}
        ratingCount={user?.ratingCount ?? 0}
        soldCount={user?.soldCount ?? 0}
        showEmail
        posts={items.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.images[0] ?? null,
          status: item.status,
        }))}
      />
    </div>
  );
}
