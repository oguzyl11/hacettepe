import { Suspense } from "react";
import { connection } from "next/server";
import { getServerDictionary } from "@/lib/i18n/server";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" />}>
        <PrivacyBody />
      </Suspense>
    </main>
  );
}

async function PrivacyBody() {
  await connection();
  const { t } = await getServerDictionary();
  const sections = [
    [t.privacy.dataTitle, t.privacy.data],
    [t.privacy.purposeTitle, t.privacy.purpose],
    [t.privacy.retentionTitle, t.privacy.retention],
    [t.privacy.transferTitle, t.privacy.transfer],
    [t.privacy.rightsTitle, t.privacy.rights],
  ];

  return (
    <article className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <h1 className="font-display text-3xl font-bold">{t.privacy.title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.privacy.intro}</p>
      <div className="mt-6 space-y-5">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
