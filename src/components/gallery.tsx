import { ItemCategory } from "@prisma/client";
import { categoryLabel } from "@/lib/labels";

const tones: Record<ItemCategory, string> = {
  KITAP: "from-rose-100 via-orange-50 to-amber-100",
  ELEKTRONIK: "from-stone-200 via-zinc-100 to-slate-200",
  GIYIM: "from-amber-100 via-rose-50 to-orange-100",
  EV_ESYASI: "from-emerald-50 via-stone-100 to-lime-50",
  SPOR: "from-sky-100 via-stone-50 to-cyan-50",
  KIRTASIYE: "from-yellow-50 via-orange-50 to-stone-100",
  DIGER: "from-stone-100 via-zinc-50 to-stone-200",
};

export function Gallery({
  category,
  images,
  title,
  compact = false,
}: {
  category: ItemCategory;
  images: string[];
  title: string;
  compact?: boolean;
}) {
  const slots = compact ? [images[0]] : [0, 1, 2, 3].map((index) => images[index]);

  return (
    <div className={compact ? "" : "grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"}>
      {slots.map((src, index) => (
        <div
          key={`${title}-${index}`}
        className={
          compact
            ? `flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${tones[category]} p-4`
            : `flex items-center justify-center bg-gradient-to-br ${tones[category]} p-4 ${
                index === 0
                  ? "min-h-64 rounded-3xl sm:row-span-3 sm:min-h-72"
                  : "hidden min-h-24 rounded-2xl sm:flex"
              }`
        }
        >
          {src ? (
            // Vercel Blob adresleri sonra bağlanacak; şimdilik kayıtlı URL doğrudan gösterilir.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${title} görseli ${index + 1}`}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <span className="text-sm font-semibold tracking-wide text-stone-800/80">
              {compact ? categoryLabel[category] : `Görsel ${index + 1}`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
