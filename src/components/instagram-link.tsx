import { InstagramMark } from "@/components/instagram-mark";
import { instagramUrl } from "@/lib/instagram";

export function InstagramLink({
  handle,
  label,
  className,
}: {
  handle: string | null | undefined;
  label: string;
  className?: string;
}) {
  const href = instagramUrl(handle);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <InstagramMark className="size-4" />
      {label}
    </a>
  );
}
