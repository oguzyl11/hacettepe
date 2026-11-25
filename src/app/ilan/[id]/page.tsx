import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { BadgeCheck, MapPin } from "lucide-react";
import { deleteItem } from "@/app/actions/item";
import { CommentSection } from "@/components/comment-section";
import { Gallery } from "@/components/gallery";
import { OwnerContact } from "@/components/owner-contact";
import { Button } from "@/components/ui/button";
import { currentStudent } from "@/lib/current-student";
import { getCategoryLabel, getConditionLabel } from "@/lib/labels";
import { getListing } from "@/lib/listings";
import { getServerDictionary } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
        <ItemBody params={params} />
      </Suspense>
    </main>
  );
}

async function ItemBody({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const [{ listing, unavailable }, student, { locale, t }] = await Promise.all([
    getListing(id),
    currentStudent(),
    getServerDictionary(),
  ]);

  if (unavailable) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
        {t.catalog.unavailable}
      </p>
    );
  }
  if (!listing) notFound();

  const commentMode = student ? "ready" : "signin";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <div className="space-y-6">
        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <span>{getCategoryLabel(listing.category, locale)}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] text-secondary normal-case">
            <BadgeCheck className="size-3" />
            @hacettepe.edu.tr
          </span>
          {listing.status === "SOLD" ? (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold text-white normal-case">
              {t.itemDetail.sold}
            </span>
          ) : null}
        </p>
        <Gallery category={listing.category} images={listing.images} title={listing.title} />
        <div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-white">
            {getConditionLabel(listing.condition, locale)}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{listing.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Beytepe · {formatDate(listing.createdAt)}
          </p>
        </div>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">{t.itemDetail.listingDesc}</h2>
          <p className="mt-2 text-sm leading-6">{listing.description}</p>
        </section>
        {student?.id === listing.owner.id ? (
          <form action={deleteItem.bind(null, listing.id)}>
            <Button type="submit" variant="outline">
              {t.itemDetail.deleteListing}
            </Button>
          </form>
        ) : null}
        <CommentSection
          itemId={listing.id}
          comments={listing.comments}
          mode={commentMode}
          viewerId={student?.id ?? null}
          ownerId={listing.owner.id}
          status={listing.status}
          buyerId={listing.buyerId}
          ratingScore={listing.ratingScore}
        />
      </div>
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <OwnerContact
          owner={listing.owner}
          ownerLabel={t.itemDetail.owner}
          scoreLabel={t.profile.score}
          noScoreLabel={t.profile.noScore}
          soldLabel={t.profile.soldItems}
          instagramLabel={t.profile.viewInstagram}
          noInstagramLabel={
            locale === "tr"
              ? "Bu ilanın Instagram hesabı yok."
              : "No Instagram account provided for this listing."
          }
        />
      </aside>
    </div>
  );
}
