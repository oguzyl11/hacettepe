import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { BadgeCheck, MapPin } from "lucide-react";
import { auth } from "@/auth";
import { CommentSection } from "@/components/comment-section";
import { Gallery } from "@/components/gallery";
import { OfferDialog } from "@/components/offer-dialog";
import { OwnerContact } from "@/components/owner-contact";
import { getTradeActivity } from "@/lib/activity";
import { categoryLabel, conditionLabel } from "@/lib/labels";
import { getListing } from "@/lib/listings";
import { formatDate } from "@/lib/utils";

export default function ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ teklif?: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
        <ItemBody params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ItemBody({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ teklif?: string }>;
}) {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [{ listing, usingSamples }, session] = await Promise.all([
    getListing(id),
    auth(),
  ]);
  if (!listing) notFound();

  const signedIn = Boolean(session?.user?.id);
  const isOwner = session?.user?.id === listing.owner.id;
  const activity = session?.user?.id ? await getTradeActivity(session.user.id) : null;
  const ownItems = (activity?.listings ?? [])
    .filter((item) => item.id !== listing.id)
    .map((item) => ({ id: item.id, title: item.title }));
  const offerMode = usingSamples ? "offline" : !signedIn ? "signin" : isOwner ? "owner" : "ready";
  const commentMode = usingSamples ? "offline" : signedIn ? "ready" : "signin";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <div className="space-y-6">
        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <span>{categoryLabel[listing.category]}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] text-secondary normal-case">
            <BadgeCheck className="size-3" />
            @hacettepe.edu.tr
          </span>
        </p>
        <Gallery category={listing.category} images={listing.images} title={listing.title} />
        <div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-white">
            {conditionLabel[listing.condition]}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{listing.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Beytepe · {formatDate(listing.createdAt)}
          </p>
        </div>
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">İlan açıklaması</h2>
          <p className="mt-2 text-sm leading-6">{listing.description}</p>
        </section>
        <CommentSection itemId={listing.id} comments={listing.comments} mode={commentMode} />
      </div>
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <OwnerContact owner={listing.owner} />
        <OfferDialog
          itemId={listing.id}
          targetTitle={listing.title}
          ownerName={listing.owner.name}
          ownItems={ownItems}
          mode={offerMode}
          defaultOpen={query.teklif === "1"}
        />
      </aside>
    </div>
  );
}
