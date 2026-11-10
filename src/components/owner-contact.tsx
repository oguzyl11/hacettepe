import { InstagramMark } from "@/components/instagram-mark";
import type { ListingOwner } from "@/lib/listings";

export function OwnerContact({ owner }: { owner: ListingOwner }) {
  const handle = owner.instagramHandle;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        {owner.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={owner.image} alt="" className="size-12 rounded-full object-cover" />
        ) : (
          <span className="grid size-12 place-items-center rounded-full bg-[#efefef] text-sm font-semibold">
            {owner.name.slice(0, 1).toLocaleUpperCase("tr")}
          </span>
        )}
        <div>
          <p className="text-xs text-muted-foreground">İlan sahibi</p>
          <p className="font-semibold">{owner.name}</p>
        </div>
      </div>
      {handle ? (
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-white"
        >
          <InstagramMark className="size-4" />
          @{handle}
        </a>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Bu ilanın Instagram hesabı yok.</p>
      )}
    </div>
  );
}
