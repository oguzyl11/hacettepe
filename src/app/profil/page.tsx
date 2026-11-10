import { Suspense } from "react";
import { connection } from "next/server";
import { ContactMethod } from "@prisma/client";
import { auth } from "@/auth";
import { ProfileScreen } from "@/components/profile-screen";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getMyListings } from "@/lib/activity";
import { getPrisma } from "@/lib/prisma";

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-full bg-muted" />}>
        <ProfileBody />
      </Suspense>
    </main>
  );
}

async function ProfileBody() {
  await connection();
  const session = await auth();
  if (!session?.user?.email || !session.user.id) {
    return <SignInPrompt title="Profilin için giriş yap" next="/profil" />;
  }

  const prisma = getPrisma();
  let user = null;
  if (prisma) {
    try {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    } catch (error) {
      console.error(error);
    }
  }

  const listings = await getMyListings(session.user.id);
  const name = user?.name ?? session.user.name ?? "Öğrenci";

  return (
    <ProfileScreen
      name={name}
      email={session.user.email}
      instagramHandle={user?.instagramHandle ?? ""}
      preferredContact={user?.preferredContact ?? ContactMethod.EMAIL}
      image={user?.image ?? null}
      databaseReady={Boolean(user)}
      posts={listings.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.images[0] ?? null,
      }))}
    />
  );
}
