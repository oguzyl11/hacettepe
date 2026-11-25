"use client";

import { useActionState, useState } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { LocaleSwitchLink } from "@/components/locale-switch-link";
import { ContactMethod } from "@prisma/client";
import { updateProfile } from "@/app/actions/user";
import { ListingPortfolio, type PortfolioItem } from "@/components/listing-portfolio";
import { InstagramLink } from "@/components/instagram-link";
import { Button } from "@/components/ui/button";
import { emptyActionState } from "@/lib/action-state";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function ProfileScreen({
  name,
  email,
  instagramHandle,
  preferredContact,
  image,
  databaseReady,
  ratingAverage,
  ratingCount,
  soldCount,
  posts,
  showEmail,
}: {
  name: string;
  email?: string;
  instagramHandle: string;
  preferredContact: ContactMethod;
  image: string | null;
  databaseReady: boolean;
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
  posts: PortfolioItem[];
  showEmail: boolean;
}) {
  const { t, locale } = useTranslation();
  const [state, action, pending] = useActionState(updateProfile, emptyActionState);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const initial = name.slice(0, 1).toLocaleUpperCase("tr");
  const photo = preview || image;
  const score =
    ratingCount > 0
      ? t.profile.score.replace("{score}", ratingAverage.toFixed(1))
      : t.profile.noScore;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <form action={action} className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-5">
          <label className="group relative shrink-0 cursor-pointer">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="size-20 rounded-full object-cover sm:size-28" />
            ) : (
              <span className="grid size-20 place-items-center rounded-full bg-muted text-2xl font-semibold sm:size-28">
                {initial}
              </span>
            )}
            {showEmail ? (
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                  setEditing(true);
                }}
              />
            ) : null}
          </label>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-bold">{name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {score} · {t.profile.soldItems.replace("{count}", String(soldCount))}
            </p>
            {showEmail && email ? (
              <p className="mt-1 text-sm text-muted-foreground">{email}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {showEmail ? (
                <button
                  type="button"
                  onClick={() => setEditing((open) => !open)}
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-semibold text-white"
                >
                  {t.profile.editProfile}
                </button>
              ) : null}
              {showEmail ? (
                <Link
                  href="/ayarlar"
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold"
                >
                  {t.profile.settingsLink}
                </Link>
              ) : null}
              <InstagramLink
                handle={instagramHandle}
                label={t.profile.viewInstagram}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-white"
              />
            </div>
          </div>
        </div>

        {showEmail && editing ? (
          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              {t.profile.name}
              <input
                name="name"
                defaultValue={name}
                required
                minLength={2}
                className="mt-1 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
              />
            </label>
            <label className="block text-sm font-medium">
              {t.profile.instagram}
              <input
                name="instagramHandle"
                defaultValue={instagramHandle}
                placeholder="kullaniciadi"
                className="mt-1 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
              />
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-medium">{t.profile.preferredContact}</legend>
              <div className="mt-2 flex gap-2">
                {[ContactMethod.EMAIL, ContactMethod.INSTAGRAM].map((method) => (
                  <label key={method} className="cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      defaultChecked={preferredContact === method}
                      className="peer sr-only"
                    />
                    <span className="inline-flex rounded-lg border border-border px-3 py-1.5 text-sm font-semibold peer-checked:bg-primary peer-checked:text-white">
                      {method === ContactMethod.EMAIL ? t.profile.email : "Instagram"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex gap-2 sm:col-span-2">
              <LocaleSwitchLink
                locale="tr"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold",
                  locale === "tr" ? "bg-primary text-white" : "border border-border",
                )}
              >
                {t.settings.turkish}
              </LocaleSwitchLink>
              <LocaleSwitchLink
                locale="en"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold",
                  locale === "en" ? "bg-primary text-white" : "border border-border",
                )}
              >
                {t.settings.english}
              </LocaleSwitchLink>
            </div>
            {state.message ? (
              <p className={cn("text-sm sm:col-span-2", state.success ? "text-emerald-700" : "text-red-700")}>
                {state.message}
              </p>
            ) : null}
            {!databaseReady ? (
              <p className="text-sm text-amber-800 sm:col-span-2">{t.profile.dbNotReady}</p>
            ) : null}
            <Button type="submit" disabled={pending || !databaseReady} className="sm:col-span-2 sm:w-fit">
              {pending ? t.common.saving : t.profile.saveProfile}
            </Button>
          </div>
        ) : showEmail ? (
          <>
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="instagramHandle" value={instagramHandle} />
            <input type="hidden" name="preferredContact" value={preferredContact} />
          </>
        ) : null}
      </form>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold">{t.profile.portfolio}</h2>
        <ListingPortfolio items={posts} soldLabel={t.itemDetail.sold} emptyLabel={t.profile.noListingsYet} />
      </section>
    </div>
  );
}
