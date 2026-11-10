import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { MessageCircle, Plus } from "lucide-react";
import { auth } from "@/auth";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getMyListings } from "@/lib/activity";
import { categoryLabel, conditionLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export default function MyListingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
        <ListingsBody />
      </Suspense>
    </main>
  );
}

async function ListingsBody() {
  await connection();
  const session = await auth();
  if (!session?.user?.id) {
    return <SignInPrompt title="İlanların için giriş yap" next="/ilanlarim" />;
  }

  const listings = await getMyListings(session.user.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">İlanlarım</h1>
          <p className="mt-1 text-sm text-muted-foreground">{listings.length} yayındaki ilan</p>
        </div>
        <Link
          href="/ilan/yeni"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-[#991b1b]"
        >
          <Plus className="size-4" />
          Yeni ilan
        </Link>
      </div>
      {listings.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
          Henüz ilanın yok. İlk takasını yayınla.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => (
            <article key={item.id} className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
                  {categoryLabel[item.category]}
                </span>
                <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-white">
                  {conditionLabel[item.condition]}
                </span>
              </div>
              <Link href={`/ilan/${item.id}`} className="mt-3 font-display text-lg font-semibold hover:text-primary">
                {item.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3.5" />
                  {item._count.comments} yorum
                </span>
                <span className="ml-auto">{formatDate(item.createdAt.toISOString())}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
