"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export function Gallery({
  images,
  title,
  conditionLabel,
  tradeLabel,
  photoLabel,
}: {
  images: string[];
  title: string;
  conditionLabel: string;
  tradeLabel: string;
  photoLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  const total = images.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm">
        {current ? (
          <Image
            src={current}
            alt={title}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#760009] px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            <BadgeCheck className="size-3.5" />
            {conditionLabel}
          </span>
          <span className="rounded-full bg-[#fe932c] px-2 py-1 text-[11px] font-bold text-[#663500]">
            {tradeLabel}
          </span>
        </div>
        {total > 0 ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-[#213145]/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            {photoLabel.replace("{current}", String(index + 1)).replace("{total}", String(total))}
          </span>
        ) : null}
      </div>
      {total > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((src, imageIndex) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={photoLabel
                .replace("{current}", String(imageIndex + 1))
                .replace("{total}", String(total))}
              className={
                imageIndex === index
                  ? "relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ring-[#760009]"
                  : "relative aspect-[4/3] overflow-hidden rounded-lg opacity-80"
              }
            >
              <Image src={src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
