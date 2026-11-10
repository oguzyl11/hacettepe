import { Suspense } from "react";
import { connection } from "next/server";
import { ContactMethod } from "@prisma/client";
import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile-form";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getPrisma } from "@/lib/prisma";

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
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

  const name = user?.name ?? session.user.name ?? "Öğrenci";

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-lg font-bold text-white">
          {name.slice(0, 1).toLocaleUpperCase("tr")}
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">Profil</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <h2 className="font-display text-lg font-semibold">İletişim ayarları</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Adın, Instagram hesabın ve tercih ettiğin iletişim burada durur.
        </p>
        <ProfileForm
          name={user?.name ?? session.user.name ?? ""}
          email={session.user.email}
          instagramHandle={user?.instagramHandle ?? ""}
          preferredContact={user?.preferredContact ?? ContactMethod.EMAIL}
          databaseReady={Boolean(user)}
        />
      </div>
    </div>
  );
}
