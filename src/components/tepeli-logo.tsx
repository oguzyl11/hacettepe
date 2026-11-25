import { cn } from "@/lib/utils";

const MARK_CLASS = "shrink-0";

export function TepeliMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn(MARK_CLASS, className)}
    >
      <rect width="120" height="120" rx="30" fill="#B91C1C" />
      <path d="M12 110 C 28 80 44 66 60 66 C 76 66 92 80 108 110 Z" fill="#FFFFFF" />
      <circle cx="60" cy="34" r="7" fill="#FFFFFF" />
      <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="73" y1="34" x2="79" y2="34" />
        <line x1="69.2" y1="43.2" x2="73.4" y2="47.4" />
        <line x1="60" y1="47" x2="60" y2="53" />
        <line x1="50.8" y1="43.2" x2="46.6" y2="47.4" />
        <line x1="47" y1="34" x2="41" y2="34" />
        <line x1="50.8" y1="24.8" x2="46.6" y2="20.6" />
        <line x1="60" y1="21" x2="60" y2="15" />
        <line x1="69.2" y1="24.8" x2="73.4" y2="20.6" />
      </g>
    </svg>
  );
}

export function TepeliWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-tight", className)}>
      <span className="text-[#B91C1C]">tepe</span>
      <span className="text-foreground">li</span>
    </span>
  );
}

export function TepeliLogo({
  markClassName,
  wordClassName,
  className,
}: {
  markClassName?: string;
  wordClassName?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <TepeliMark className={markClassName ?? "size-8"} />
      <TepeliWordmark className={wordClassName ?? "text-lg"} />
    </span>
  );
}
