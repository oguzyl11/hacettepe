"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  X,
  ArrowRight,
  BookOpen,
  Laptop,
  Shirt,
  Lamp,
  Trophy,
  PenTool,
  Package,
  Tag,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AutocompleteResult,
} from "@/lib/search";
import { useTranslation } from "@/lib/i18n/context";
import { categories, getCategoryLabel } from "@/lib/labels";

const conditionBadgeColor: Record<string, string> = {
  YENI_GIBI: "bg-emerald-600 text-white",
  AZ_KULLANILMIS: "bg-secondary text-white",
  ORTA_KULLANILMIS: "bg-amber-500 text-white",
  COK_KULLANILMIS: "bg-slate-600 text-white",
};

function getCategoryIcon(categoryKey: string) {
  switch (categoryKey) {
    case "KITAP":
      return BookOpen;
    case "ELEKTRONIK":
      return Laptop;
    case "GIYIM":
      return Shirt;
    case "EV_ESYASI":
      return Lamp;
    case "SPOR":
      return Trophy;
    case "KIRTASIYE":
      return PenTool;
    default:
      return Package;
  }
}

function HighlightText({
  text,
  query,
  locale = "tr",
}: {
  text: string;
  query: string;
  locale?: string;
}) {
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  const loc = locale === "tr" ? "tr" : "en";
  const lowerQuery = trimmed.toLocaleLowerCase(loc);
  const lowerText = text.toLocaleLowerCase(loc);
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmed.length);
  const after = text.slice(matchIndex + trimmed.length);

  return (
    <span>
      {before}
      <mark className="rounded-xs bg-primary/10 px-0.5 font-bold text-primary">
        {match}
      </mark>
      {after}
    </span>
  );
}

type NavItem =
  | { type: "category"; key: string; label: string }
  | { type: "listing"; id: string; title: string }
  | { type: "all"; query: string }
  | { type: "popular"; term: string };

type SearchAutocompleteProps = {
  className?: string;
  placeholder?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
};

export function SearchAutocomplete({
  className,
  placeholder,
  onNavigate,
  autoFocus = false,
}: SearchAutocompleteProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AutocompleteResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const listboxId = useId();

  const currentPlaceholder = placeholder || t.common.searchPlaceholder;

  // Sync with URL when search params change externally
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setQuery(searchParams?.get("q") ?? "");
    }
  }, [searchParams]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(
            trimmed
          )}&limit=5&locale=${locale}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data: AutocompleteResult = await res.json();
          setResults(data);
          setSelectedIndex(-1);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Öneri alınamadı:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale]);

  // Build current navigable items list for keyboard navigation
  const trimmed = query.trim();
  const navItems: NavItem[] = [];

  if (trimmed) {
    if (results?.categories) {
      results.categories.forEach((cat) => {
        navItems.push({ type: "category", key: cat.key, label: cat.label });
      });
    }
    if (results?.listings) {
      results.listings.forEach((listing) => {
        navItems.push({
          type: "listing",
          id: listing.id,
          title: listing.title,
        });
      });
    }
    navItems.push({ type: "all", query: trimmed });
  } else if (results?.popularSearches) {
    results.popularSearches.forEach((term) => {
      navItems.push({ type: "popular", term });
    });
  }

  const navigateTo = useCallback(
    (url: string) => {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      onNavigate?.();
      router.push(url);
    },
    [router, onNavigate]
  );

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const targetQ = query.trim();
    if (targetQ) {
      navigateTo(`/?q=${encodeURIComponent(targetQ)}`);
    } else {
      navigateTo("/");
    }
  };

  const handleSelect = (item: NavItem) => {
    switch (item.type) {
      case "category":
        navigateTo(`/?kategori=${item.key}`);
        break;
      case "listing":
        navigateTo(`/ilan/${item.id}`);
        break;
      case "all":
        navigateTo(`/?q=${encodeURIComponent(item.query)}`);
        break;
      case "popular":
        setQuery(item.term);
        navigateTo(`/?q=${encodeURIComponent(item.term)}`);
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (navItems.length === 0) return;
      setSelectedIndex((prev) => (prev + 1 < navItems.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (navItems.length === 0) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : navItems.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < navItems.length) {
        e.preventDefault();
        handleSelect(navItems[selectedIndex]);
      } else {
        handleSubmit(e);
      }
    }
  };

  const clearQuery = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} role="search" className="relative w-full">
        <label htmlFor="search-input" className="sr-only">
          {t.search.listingsHeader}
        </label>
        <div className="relative flex w-full items-center">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            id="search-input"
            name="q"
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={
              selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
            }
            className="h-10 w-full rounded-full border border-border bg-muted/60 pr-16 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />

          <div className="absolute right-3 flex items-center gap-1">
            {isLoading && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
            {query.length > 0 && (
              <button
                type="button"
                onClick={clearQuery}
                aria-label={t.search.clearSearch}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[75vh] overflow-hidden overflow-y-auto rounded-2xl border border-border bg-card shadow-xl ring-1 ring-black/5"
        >
          {trimmed ? (
            <div>
              {/* Category Suggestions */}
              {results?.categories && results.categories.length > 0 && (
                <div className="border-b border-border/60 p-2">
                  <p className="px-2 pt-1 pb-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                    {t.search.categoriesHeader}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.categories.map((cat, idx) => {
                      const itemIndex = idx;
                      const isSelected = selectedIndex === itemIndex;
                      return (
                        <button
                          key={cat.key}
                          id={`suggestion-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelect({
                              type: "category",
                              key: cat.key,
                              label: cat.label,
                            });
                          }}
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "bg-muted/70 text-foreground hover:bg-muted"
                          )}
                        >
                          <Tag className="size-3" />
                          <span>{cat.label}</span>
                          <span
                            className={cn(
                              "text-[10px]",
                              isSelected
                                ? "text-white/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {t.search.searchInCategory}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matching Listings */}
              {results?.listings && results.listings.length > 0 ? (
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      {t.search.listingsHeader}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {t.search.matchesCount.replace(
                        "{count}",
                        String(results.totalMatches)
                      )}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {results.listings.map((item, idx) => {
                      const itemIndex =
                        (results.categories?.length ?? 0) + idx;
                      const isSelected = selectedIndex === itemIndex;
                      const Icon = getCategoryIcon(item.category);

                      return (
                        <li key={item.id} role="none">
                          <Link
                            href={`/ilan/${item.id}`}
                            id={`suggestion-${itemIndex}`}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelect({
                                type: "listing",
                                id: item.id,
                                title: item.title,
                              });
                            }}
                            className={cn(
                              "flex items-center gap-3 rounded-xl p-2 transition-colors",
                              isSelected
                                ? "bg-muted ring-1 ring-primary/20"
                                : "hover:bg-muted/60"
                            )}
                          >
                            {/* Thumbnail or Category Icon */}
                            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-muted-foreground">
                                  <Icon className="size-5" />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                <HighlightText
                                  text={item.title}
                                  query={trimmed}
                                  locale={locale}
                                />
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                  {item.categoryLabel}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                    conditionBadgeColor[item.condition] ??
                                      "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {item.conditionLabel}
                                </span>
                              </div>
                            </div>

                            <ArrowRight
                              className={cn(
                                "size-4 shrink-0 transition-transform",
                                isSelected
                                  ? "translate-x-0.5 text-primary"
                                  : "text-muted-foreground/50"
                              )}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : !isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Search className="size-5" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {t.search.noResultsFound.replace("{query}", trimmed)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.search.noResultsHint}
                  </p>
                </div>
              ) : null}

              {/* View All Matches Footer */}
              {results && (
                <div className="border-t border-border bg-muted/30 p-2">
                  {(() => {
                    const allItemIndex =
                      (results.categories?.length ?? 0) +
                      (results.listings?.length ?? 0);
                    const isSelected = selectedIndex === allItemIndex;

                    return (
                      <button
                        type="button"
                        id={`suggestion-${allItemIndex}`}
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                          isSelected
                            ? "bg-primary text-white"
                            : "text-primary hover:bg-primary/10"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          <Search className="size-3.5" />
                          <span>
                            {t.search.seeAllResults.replace("{query}", trimmed)}
                          </span>
                        </span>
                        {results.totalMatches > 0 && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px]",
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {results.totalMatches}{" "}
                            {locale === "tr" ? "ilan" : "listings"}
                          </span>
                        )}
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* Empty Query View: Popular Searches & Categories */
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                <TrendingUp className="size-3.5 text-primary" />
                <span>{t.search.popularSearches}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {(results?.popularSearches || []).map((term, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={term}
                      type="button"
                      id={`suggestion-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect({ type: "popular", term });
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground hover:bg-slate-200"
                      )}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-border/60 pt-3">
                <p className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  {t.search.quickCategories}
                </p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {categories.map((catKey) => {
                    const Icon = getCategoryIcon(catKey);
                    const label = getCategoryLabel(catKey, locale);
                    return (
                      <button
                        key={catKey}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigateTo(`/?kategori=${catKey}`);
                        }}
                        className="flex items-center gap-2 rounded-lg border border-border/80 bg-card p-2 text-left text-xs font-medium text-foreground hover:border-primary hover:bg-muted/40 transition-colors"
                      >
                        <div className="grid size-6 place-items-center rounded bg-muted text-muted-foreground">
                          <Icon className="size-3.5" />
                        </div>
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MobileSearchToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Aramayı kapat" : "Arama yap"}
        className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        {open ? <X className="size-4" /> : <Search className="size-4" />}
      </button>

      {open && (
        <div className="absolute top-16 right-0 left-0 z-40 border-b border-border bg-card px-4 py-3 shadow-lg">
          <SearchAutocomplete autoFocus onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
