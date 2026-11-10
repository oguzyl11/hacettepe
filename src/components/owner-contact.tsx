import { ContactMethod } from "@prisma/client";
import { Mail } from "lucide-react";
import type { ListingOwner } from "@/lib/listings";

export function OwnerContact({ owner }: { owner: ListingOwner }) {
  const instagram =
    owner.preferredContact === ContactMethod.INSTAGRAM && owner.instagramHandle
      ? owner.instagramHandle
      : null;

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        İlan sahibi
      </p>
      <p className="mt-1 text-lg font-semibold">{owner.name}</p>
      {instagram ? (
        <a
          href={`https://instagram.com/${instagram}`}
          className="mt-3 inline-flex text-sm font-medium text-primary"
          target="_blank"
          rel="noreferrer"
        >
          Instagram: @{instagram}
        </a>
      ) : (
        <a
          href={`mailto:${owner.email}`}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <Mail className="size-4" />
          {owner.email}
        </a>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Tercih edilen iletişim{" "}
        {instagram ? "Instagram hesabı" : "Hacettepe e-postası"}.
      </p>
    </div>
  );
}
