import Link from "next/link";
import { InstagramLink } from "@/components/instagram-link";
import type { ListingOwner } from "@/lib/listings";

export function OwnerContact({
  owner,
  ownerLabel,
  scoreLabel,
  noScoreLabel,
  soldLabel,
  instagramLabel,
  noInstagramLabel,
}: {
  owner: ListingOwner;
  ownerLabel: string;
  scoreLabel: string;
  noScoreLabel: string;
  soldLabel: string;
  instagramLabel: string;
  noInstagramLabel: string;
}) {
  const score =
    owner.ratingCount > 0
      ? scoreLabel.replace("{score}", owner.ratingAverage.toFixed(1))
      : noScoreLabel;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        {owner.image ? (
          // Profile photos are served from this app or Blob; size is fixed by the avatar frame.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={owner.image} alt="" className="size-12 rounded-full object-cover" />
        ) : (
          <span className="grid size-12 place-items-center rounded-full bg-muted text-sm font-semibold">
            {owner.name.slice(0, 1).toLocaleUpperCase("tr")}
          </span>
        )}
        <div>
          <p className="text-xs text-muted-foreground">{ownerLabel}</p>
          <Link href={`/profil/${owner.id}`} className="font-display font-semibold hover:text-primary">
            {owner.name}
          </Link>
          <p className="text-sm text-muted-foreground">
            {score} · {soldLabel.replace("{count}", String(owner.soldCount))}
          </p>
        </div>
      </div>
      <InstagramLink
        handle={owner.instagramHandle}
        label={instagramLabel}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-white"
      />
      {owner.instagramHandle ? null : (
        <p className="mt-4 text-sm text-muted-foreground">{noInstagramLabel}</p>
      )}
    </div>
  );
}
