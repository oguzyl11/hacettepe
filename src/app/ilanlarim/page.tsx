import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { MessageCircle, Plus } from "lucide-react";
import { auth } from "@/auth";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { getMyListings } from "@/lib/activity";
import { getCategoryLabel, getConditionLabel } from "@/lib/labels";
import { getServerDictionary } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

export default function MyListingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense
        fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}
      >
        <ListingsBody />
      </Suspense>
    </main>
  );
}

async function ListingsBody() {
  await connection();
  const [session, { t, locale }] = await Promise.all([
    auth(),
    getServerDictionary(),
  ]);

  if (!session?.user?.id) {
    return (
      <SignInPrompt
        title={
          locale === "tr"
            ? "İlanların için giriş yap"
            : "Sign in to view your listings"
        }
        next="/ilanlarim"
      />
    );
  }

  const listings = await getMyListings(session.user.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {t.myListings.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length}{" "}
            {locale === "tr" ? "yayındaki ilan" : "active listings"}
          </p>
        </div>
        <Link
          href="/ilan/yeni"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-[#991b1b] transition-colors"
        >
          <Plus className="size-4" />
          {t.common.nav.newListing}
        </Link>
      </div>
      {listings.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
          {locale === "tr"
            ? "Henüz ilanın yok. İlk takasını yayınla."
            : "You have no listings yet. Post your first trade."}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600 uppercase">
                  {getCategoryLabel(item.category, locale)}
                </span>
                <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-white">
                  {getConditionLabel(item.condition, locale)}
                </span>
              </div>
              <Link
                href={`/ilan/${item.id}`}
                className="mt-3 font-display text-lg font-semibold hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3.5" />
                  {item._count.comments} {locale === "tr" ? "yorum" : "comments"}
                </span>
                <span className="ml-auto">
                  {formatDate(item.createdAt.toISOString())}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
