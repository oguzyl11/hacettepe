import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { SettingsScreen } from "@/components/settings-screen";

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-2xl bg-muted/60" />
        }
      >
        <SettingsBody />
      </Suspense>
    </main>
  );
}

async function SettingsBody() {
  await connection();
  const session = await auth();

  return <SettingsScreen userEmail={session?.user?.email} />;
}
