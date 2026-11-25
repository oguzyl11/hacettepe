"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  AtSign,
  BadgeCheck,
  CloudUpload,
  Eye,
  MapPin,
  Send,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { createItem } from "@/app/actions/item";
import { emptyActionState } from "@/lib/action-state";
import {
  categories,
  conditions,
  getCategoryLabel,
  getConditionLabel,
} from "@/lib/labels";
import { useTranslation } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const titleMaxLength = 80;
const descriptionMinLength = 10;
const descriptionMaxLength = 2000;
const photoMaxCount = 4;

const fieldClass =
  "h-11 w-full rounded-lg bg-[#eff4ff] px-3 text-sm text-[#0b1c30] shadow-sm outline-none placeholder:text-[#8d706d] focus:bg-white focus:ring-2 focus:ring-[#760009]";

export function ListingForm({
  databaseReady,
  author,
}: {
  databaseReady: boolean;
  author: {
    name: string;
    email: string;
    instagramHandle: string | null;
  };
}) {
  const { t, locale } = useTranslation();
  const [state, action, pending] = useActionState(createItem, emptyActionState);
  const fileInput = useRef<HTMLInputElement>(null);
  const previewUrls = useRef<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [condition, setCondition] = useState(conditions[0]);
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const urls = previewUrls;
    return () => {
      for (const url of urls.current) URL.revokeObjectURL(url);
    };
  }, []);

  const syncFiles = (next: File[]) => {
    const limited = next.slice(0, photoMaxCount);
    const transfer = new DataTransfer();
    for (const file of limited) transfer.items.add(file);
    if (fileInput.current) fileInput.current.files = transfer.files;
    for (const url of previewUrls.current) URL.revokeObjectURL(url);
    const created = limited.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    previewUrls.current = created.map((item) => item.url);
    setPreviews(created);
  };

  const initial = (author.name || "?").slice(0, 1).toLocaleUpperCase("tr");

  return (
    <div className="grid items-start gap-5 lg:grid-cols-12">
      <form action={action} className="flex flex-col gap-5 lg:col-span-8">
        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading
            index="1"
            title={t.newListing.basicsTitle}
            hint={t.newListing.basicsHint}
            badge={t.newListing.requiredFields}
          />
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0b1c30]" htmlFor="title">
            <span className="flex items-center justify-between">
              <span>
                {t.newListing.itemTitle} <span className="text-[#760009]">*</span>
              </span>
              <span className="text-xs font-normal text-[#8d706d]">
                {title.length}/{titleMaxLength}
              </span>
            </span>
            <input
              id="title"
              name="title"
              required
              minLength={3}
              maxLength={titleMaxLength}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t.newListing.titlePlaceholder}
              className={fieldClass}
            />
            <span className="text-xs font-normal text-[#59413e]">{t.newListing.titleHint}</span>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#0b1c30]" htmlFor="category">
            <span>
              {t.newListing.category} <span className="text-[#760009]">*</span>
            </span>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value as typeof category)}
              className={cn(fieldClass, "appearance-none")}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {getCategoryLabel(item, locale)}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading index="2" title={t.newListing.tradeTitle} hint={t.newListing.tradeHint} />
          <div className="rounded-lg bg-[#eff4ff] p-4 shadow-[inset_0_0_0_2px_#760009]">
            <ArrowLeftRight className="size-6 text-[#904d00]" />
            <p className="mt-2 text-base font-semibold text-[#0b1c30]">{t.newListing.tradeOnly}</p>
            <p className="text-xs text-[#59413e]">{t.newListing.tradeOnlyHint}</p>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading index="3" title={t.newListing.placeTitle} hint={t.newListing.placeHint} />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-[#0b1c30]">
              {t.newListing.condition} <span className="text-[#760009]">*</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {conditions.map((item) => (
                <label key={item} className="cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={item}
                    checked={condition === item}
                    onChange={() => setCondition(item)}
                    className="peer sr-only"
                    required
                  />
                  <span className="inline-flex rounded-full bg-[#eff4ff] px-4 py-2 text-xs font-semibold text-[#59413e] peer-checked:bg-[#991b1b] peer-checked:text-white peer-checked:shadow-sm">
                    {getConditionLabel(item, locale)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading
            index="4"
            title={t.newListing.photosTitle}
            hint={t.newListing.photosHint}
            badge={t.newListing.photoCount.replace("{count}", String(previews.length))}
            mutedBadge
          />
          <label className="relative flex cursor-pointer flex-col items-center rounded-xl bg-[#eff4ff]/70 px-4 py-8 text-center">
            <input
              ref={fileInput}
              id="images"
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(event) => syncFiles(Array.from(event.target.files ?? []))}
            />
            <span className="pointer-events-none grid size-14 place-items-center rounded-full bg-white text-[#760009] shadow-sm">
              <CloudUpload className="size-7" />
            </span>
            <span className="pointer-events-none mt-3 text-base font-semibold text-[#0b1c30]">
              {t.newListing.dropTitle}
            </span>
            <span className="pointer-events-none mt-1 max-w-md text-xs text-[#8d706d]">
              {t.newListing.dropHint}
            </span>
            <span className="pointer-events-none mt-4 rounded bg-white px-4 py-2 text-xs font-semibold text-[#760009] shadow-sm">
              {t.newListing.chooseFiles}
            </span>
          </label>
          {previews.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <div key={preview.url} className="relative aspect-square overflow-hidden rounded-lg bg-[#dce9ff]">
                  {/* blob: previews are local files, not remote images next/image can optimize. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt="" className="h-full w-full object-cover" />
                  {index === 0 ? (
                    <span className="absolute top-1.5 left-1.5 rounded bg-[#760009] px-2 py-0.5 text-[11px] font-bold text-white">
                      {t.newListing.cover}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={t.newListing.removePhoto}
                    onClick={() =>
                      syncFiles(
                        previews
                          .filter((_, fileIndex) => fileIndex !== index)
                          .map((item) => item.file),
                      )
                    }
                    className="absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-full bg-[#ba1a1a] text-white"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading
            index="5"
            title={t.newListing.descriptionTitle}
            hint={t.newListing.descriptionHint}
          />
          <textarea
            id="description"
            name="description"
            required
            minLength={descriptionMinLength}
            maxLength={descriptionMaxLength}
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t.newListing.descPlaceholder}
            className="w-full resize-y rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] outline-none placeholder:text-[#8d706d] focus:bg-white focus:ring-2 focus:ring-[#760009]"
          />
        </section>

        <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading index="6" title={t.newListing.contactTitle} hint={t.newListing.contactHint} />
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0b1c30]">{t.newListing.emailVerifiedLabel}</p>
              <div className="mt-1 flex h-11 items-center justify-between rounded-lg bg-[#eff4ff] px-3 text-sm">
                <span className="font-semibold text-[#003a5b]">{maskEmail(author.email)}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#760009]">
                  <BadgeCheck className="size-4" />
                  {t.newListing.verified}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b1c30]">{t.newListing.instagramOnCard}</p>
              <div className="mt-1 flex h-11 items-center gap-2 rounded-lg bg-[#eff4ff] px-3 text-sm text-[#59413e]">
                <AtSign className="size-4" />
                <span className="truncate">{author.instagramHandle || "—"}</span>
              </div>
            </div>
          </div>
        </section>

        {!databaseReady ? (
          <p className="text-sm text-amber-800">{t.profile.dbNotReady}</p>
        ) : null}
        {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}

        <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#e5eeff] px-5 py-2.5 text-sm font-semibold text-[#0b1c30] sm:w-auto"
          >
            <X className="mr-1 size-4" />
            {t.newListing.cancel}
          </Link>
          <button
            type="submit"
            disabled={pending || !databaseReady}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#760009] px-6 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60 sm:w-auto"
          >
            <Send className="size-5" />
            {pending ? t.common.saving : t.newListing.publishNow}
          </button>
        </div>
      </form>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:col-span-4">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-1.5 text-base font-semibold text-[#0b1c30]">
            <Eye className="size-5 text-[#760009]" />
            {t.newListing.previewTitle}
          </h2>
          <span className="rounded-full bg-[#ffdcc3] px-2 py-0.5 text-[11px] font-bold text-[#904d00]">
            {t.newListing.showcaseCard}
          </span>
        </div>
        <article className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="relative aspect-square bg-[#eff4ff]">
            {previews[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[0].url} alt="" className="h-full w-full object-cover" />
            ) : null}
            <span className="absolute top-2.5 left-2.5 rounded-md bg-[#0b1c30]/80 px-2 py-0.5 text-[11px] font-semibold text-white">
              {getConditionLabel(condition, locale)}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center justify-between text-[11px] text-[#8d706d]">
              <span className="font-bold tracking-wider uppercase">
                {getCategoryLabel(category, locale)}
              </span>
              <span>{t.newListing.previewNow}</span>
            </div>
            <h3 className="line-clamp-2 text-base font-semibold text-[#0b1c30]">
              {title.trim() || t.newListing.previewEmpty}
            </h3>
            {description.trim() ? (
              <p className="line-clamp-2 text-xs text-[#59413e]">{description}</p>
            ) : null}
            <p className="inline-flex items-center gap-1 pt-1 text-xs text-[#59413e]">
              <MapPin className="size-3.5" />
              {t.common.location}
              <span className="ml-auto inline-flex items-center gap-1 font-semibold">
                <span className="grid size-5 place-items-center rounded-full bg-[#760009] text-[10px] text-white">
                  {initial}
                </span>
                {author.name}
              </span>
            </p>
          </div>
          {author.instagramHandle ? (
            <div className="flex items-center gap-1 bg-[#eff4ff] px-4 py-2 text-[11px] font-semibold text-[#59413e]">
              <AtSign className="size-3.5" />
              {author.instagramHandle}
            </div>
          ) : null}
        </article>
        <section className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-[#0b1c30]">
            <Shield className="size-5 text-[#760009]" />
            {t.newListing.safetyTitle}
          </h2>
          <ul className="space-y-2 text-sm text-[#59413e]">
            <li>{t.newListing.safetyCampus}</li>
            <li>{t.newListing.safetyPayment}</li>
            <li>{t.newListing.safetyEmail}</li>
          </ul>
          <div className="flex items-center justify-between rounded bg-[#eff4ff] p-2 text-sm">
            <span className="text-[#8d706d]">{t.newListing.community}</span>
            <Link href="/gizlilik" className="font-semibold text-[#760009] hover:underline">
              {t.newListing.readGuide}
            </Link>
          </div>
        </section>
      </aside>
    </div>
  );
}

type Preview = { file: File; url: string };

function SectionHeading({
  index,
  title,
  hint,
  badge,
  mutedBadge = false,
}: {
  index: string;
  title: string;
  hint: string;
  badge?: string;
  mutedBadge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-[#dce9ff] text-base font-semibold text-[#760009]">
          {index}
        </span>
        <span>
          <span className="block text-base font-semibold text-[#0b1c30]">{title}</span>
          <span className="block text-xs text-[#8d706d]">{hint}</span>
        </span>
      </div>
      {badge ? (
        <span
          className={
            mutedBadge
              ? "text-[11px] font-semibold text-[#8d706d]"
              : "rounded bg-[#ffdad6] px-2 py-0.5 text-[11px] font-bold tracking-wide text-[#8e1214] uppercase"
          }
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 1)}${"*".repeat(Math.max(3, local.length - 1))}@${domain}`;
}
