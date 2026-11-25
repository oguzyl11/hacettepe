import { Suspense, type ReactNode } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { BadgeCheck, ChevronRight, Library, MapPin, ShieldCheck, Star, Utensils } from "lucide-react";
import { CommentSection } from "@/components/comment-section";
import { DeleteListingForm } from "@/components/delete-listing-form";
import { DetailTabs, OfferButton } from "@/components/detail-tabs";
import { Gallery } from "@/components/gallery";
import { InstagramLink } from "@/components/instagram-link";
import { ItemCard } from "@/components/item-card";
import { currentStudent } from "@/lib/current-student";
import { getCategoryLabel, getConditionLabel } from "@/lib/labels";
import { getListing, getListings } from "@/lib/listings";
import { getServerDictionary } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 bg-[#f8f9ff] px-4 py-6 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-white" />}>
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
      <p className="rounded-xl border border-dashed border-border bg-white px-4 py-16 text-center text-sm text-muted-foreground">
        {t.catalog.unavailable}
      </p>
    );
  }
  if (!listing) notFound();

  const related = await getListings({ category: listing.category });
  const similar = related.unavailable
    ? []
    : related.listings.filter((item) => item.id !== listing.id).slice(0, 4);
  const commentMode = student ? "ready" : "signin";
  const categoryLabel = getCategoryLabel(listing.category, locale);
  const conditionLabel = getConditionLabel(listing.condition, locale);
  const score =
    listing.owner.ratingCount > 0
      ? t.profile.score.replace("{score}", listing.owner.ratingAverage.toFixed(1))
      : t.profile.noScore;
  const sold = t.profile.soldItems.replace("{count}", String(listing.owner.soldCount));
  const initials = listing.owner.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toLocaleUpperCase("tr");
  const facts = [
    { label: t.catalog.category, value: categoryLabel },
    { label: t.catalog.condition, value: conditionLabel },
    { label: t.itemDetail.postedOn, value: formatDate(listing.createdAt, locale) },
    {
      label: t.itemDetail.statusLabel,
      value: listing.status === "SOLD" ? t.itemDetail.sold : t.itemDetail.active,
    },
    { label: t.itemDetail.messages, value: String(listing.commentCount) },
    { label: t.itemDetail.rating, value: score },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <nav className="flex flex-wrap items-center gap-1 text-xs font-medium text-[#59413e]">
          <Link href="/" className="hover:text-[#760009]">
            {t.newListing.breadcrumbHome}
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/?kategori=${listing.category}#ilanlar`} className="hover:text-[#760009]">
            {categoryLabel}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="max-w-64 truncate text-[#0b1c30]">{listing.title}</span>
        </nav>
        <p className="text-xs text-[#8d706d]">
          {t.itemDetail.listingNo} {listing.id.slice(-6).toLocaleUpperCase(locale)} · {formatDate(listing.createdAt, locale)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Gallery
            images={listing.images}
            title={listing.title}
            conditionLabel={conditionLabel}
            tradeLabel={t.itemDetail.tradeOpen}
            photoLabel={t.itemDetail.photoIndex}
          />
          <div className="flex gap-4 rounded-xl border border-[#c6c6cd]/40 bg-[#dce9ff] p-4">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-[#0058be]" />
            <div>
              <p className="text-sm font-bold text-[#0b1c30]">
                {t.itemDetail.safeTitle}
                <span className="ml-2 rounded-full bg-[#0058be] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                  {t.itemDetail.safeRecommended}
                </span>
              </p>
              <p className="mt-1 text-sm leading-6 text-[#59413e]">{t.itemDetail.safeText}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <span className="inline-flex rounded-full bg-[#ffdcc3] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#663500] uppercase">
              {categoryLabel}
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0b1c30] sm:text-3xl">{listing.title}</h1>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-[#59413e]">
              <MapPin className="size-4 text-[#760009]" />
              {t.common.location}
            </p>
            <div className="mt-4 rounded-xl border border-[#ffdcc3] bg-[#fff4ee] p-4">
              <p className="text-xs font-bold tracking-wide text-[#663500] uppercase">{t.itemDetail.ownerNote}</p>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#0b1c30]">{listing.description}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              {listing.owner.image ? (
                // Profile photos are served from this app or Blob; the frame fixes the size.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.owner.image} alt="" className="size-12 rounded-full object-cover" />
              ) : (
                <span className="grid size-12 place-items-center rounded-full bg-[#991b1b] text-sm font-bold text-white">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <Link href={`/profil/${listing.owner.id}`} className="inline-flex items-center gap-1 font-bold text-[#0b1c30] hover:text-[#760009]">
                  <span className="truncate">{listing.owner.name}</span>
                  <BadgeCheck className="size-4 shrink-0 text-[#0058be]" />
                </Link>
                <p className="text-xs text-[#59413e]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0b1c30]">
                    <Star className="size-3.5 fill-[#904d00] text-[#904d00]" />
                    {score}
                  </span>
                  {" · "}
                  {sold}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-[#0058be]">{t.itemDetail.verifiedStudent}</p>
            <div className="mt-4 space-y-2">
              <InstagramLink
                handle={listing.owner.instagramHandle}
                label={t.profile.viewInstagram}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#c6c6cd] text-sm font-semibold text-[#0b1c30] hover:bg-[#f8f9ff]"
              />
              {listing.status === "ACTIVE" ? <OfferButton label={t.itemDetail.offer} /> : null}
              {student?.id === listing.owner.id ? (
                <DeleteListingForm itemId={listing.id} label={t.itemDetail.deleteListing} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <DetailTabs
        specsLabel={t.itemDetail.specsTab}
        deliveryLabel={t.itemDetail.deliveryTab}
        messagesLabel={t.itemDetail.messages}
        messageCount={listing.comments.length}
        specs={
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[#0b1c30]">{t.itemDetail.factsTitle}</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="rounded-xl bg-[#f8f9ff] px-4 py-3">
                    <dt className="text-[11px] font-bold tracking-wide text-[#8d706d] uppercase">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#0b1c30]">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0b1c30]">{t.itemDetail.ownerNote}</h2>
              <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-[#0b1c30]">{listing.description}</p>
            </div>
          </div>
        }
        delivery={
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0b1c30]">{t.itemDetail.deliveryTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#59413e]">{t.itemDetail.deliveryText}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <MeetCard icon={<Library className="size-5" />} title={t.itemDetail.meetLibrary} text={t.itemDetail.meetLibraryText} />
              <MeetCard icon={<Utensils className="size-5" />} title={t.itemDetail.meetDining} text={t.itemDetail.meetDiningText} />
              <MeetCard icon={<MapPin className="size-5" />} title={t.itemDetail.meetCampus} text={t.itemDetail.meetCampusText} />
            </div>
          </div>
        }
        messages={
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
        }
      />

      {similar.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">{t.itemDetail.similarTitle}</h2>
            <Link href={`/?kategori=${listing.category}#ilanlar`} className="text-sm font-semibold text-[#760009]">
              {t.home.seeAllListings}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <ItemCard
                key={item.id}
                listing={item}
                locale={locale}
                soldLabel={t.itemDetail.sold}
                scoreLabel={t.profile.score}
                locationLabel={t.common.location}
                reachLabel={t.catalog.reachInstagram}
                viewLabel={t.catalog.viewListing}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function MeetCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl bg-[#f8f9ff] p-4">
      <div className="mb-2 text-[#760009]">{icon}</div>
      <p className="text-sm font-bold text-[#0b1c30]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#59413e]">{text}</p>
    </div>
  );
}
