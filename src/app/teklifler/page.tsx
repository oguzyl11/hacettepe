import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { OfferStatus } from "@prisma/client";
import { auth } from "@/auth";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getTradeActivity } from "@/lib/activity";
import { formatDate } from "@/lib/utils";

const statusLabel: Record<OfferStatus, string> = {
  PENDING: "Bekliyor",
  ACCEPTED: "Kabul edildi",
  REJECTED: "Reddedildi",
  CANCELLED: "Vazgeçildi",
};

const statusTone: Record<OfferStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function OffersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
        <OffersBody />
      </Suspense>
    </main>
  );
}

async function OffersBody() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) {
    return <SignInPrompt title="Tekliflerin için giriş yap" next="/teklifler" />;
  }

  const activity = await getTradeActivity(session.user.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Tekliflerim</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sana gelen ve senin gönderdiğin takas teklifleri.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
              <ArrowDownLeft className="size-4 text-primary" />
              Gelen teklifler
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">{activity.incoming.length}</span>
          </header>
          <div className="space-y-3">
            {activity.incoming.map((offer) => (
              <article key={offer.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-primary">{offer.sender.name || offer.sender.email}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone[offer.status]}`}>
                    {statusLabel[offer.status]}
                  </span>
                </div>
                <Link href={`/ilan/${offer.item.id}`} className="mt-1 block font-semibold hover:text-primary">
                  {offer.item.title}
                </Link>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.message}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(offer.createdAt.toISOString())}</p>
              </article>
            ))}
            {activity.incoming.length === 0 ? <Empty text="Henüz gelen teklif yok." /> : null}
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
              <ArrowUpRight className="size-4 text-secondary" />
              Yaptığım teklifler
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">{activity.outgoing.length}</span>
          </header>
          <div className="space-y-3">
            {activity.outgoing.map((offer) => (
              <article key={offer.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{offer.item.owner.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone[offer.status]}`}>
                    {statusLabel[offer.status]}
                  </span>
                </div>
                <Link href={`/ilan/${offer.item.id}`} className="mt-1 block font-semibold hover:text-primary">
                  {offer.item.title}
                </Link>
                <p className="mt-2 text-sm leading-6">{offer.message}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(offer.createdAt.toISOString())}</p>
              </article>
            ))}
            {activity.outgoing.length === 0 ? <Empty text="Henüz teklif göndermedin." /> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
