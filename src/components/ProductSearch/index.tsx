"use client";

import { LocaleLink as Link, useLocale } from "@/components/LocaleLink";
import { localeHref } from "@/lib/i18n/locales";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  highlight,
  searchProducts,
  type SearchHit,
} from "@/lib/product-search";
import type { Product } from "@/lib/products";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Product search.

   Speaks the same language as the rest of the site:
     · controls are pills (this field, the chips, the buttons)
     · surfaces are rounded rectangles separated by fill, never by a border
     · a raised surface carries a 1px inset highlight along its top edge

   `surface` picks which step of the ramp the field sits on. Inside the
   catalog's graphite control panel it renders as a "well" (darker than its
   container, the way the card image tiles do); standing alone on the page
   it renders "raised".
   ========================================================================== */

type Props = {
  /* The catalog to search. It used to default to a hardcoded array inside
     src/lib/products.ts, which meant this dropdown quietly suggested units
     that no longer existed in the CMS — and missed every one that had been
     added since. It is passed in from the page's real product list now. */
  products: Product[];
  value: string;
  onChange: (next: string) => void;
  onSubmit?: (next: string) => void;
  placeholder?: string;
  maxResults?: number;
  surface?: "raised" | "well";
};

export function ProductSearch({
  products,
  value,
  onChange,
  onSubmit,
  placeholder = "Search turbos, codes, vehicles, specs…",
  maxResults = 6,
  surface = "raised",
}: Props) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(
    () =>
      value.trim() ? searchProducts(value, products).slice(0, maxResults) : [],
    [value, products, maxResults],
  );

  useEffect(() => setActive(0), [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const showDropdown = open && value.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="group relative flex items-center">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="product-search-listbox"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              if (hits[active] && showDropdown) {
                e.preventDefault();
                window.location.assign(
                  localeHref(locale, `/catalog/${hits[active].product.id}`),
                );
              } else {
                onSubmit?.(value);
                setOpen(false);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          className={cn(
            "w-full rounded-full py-3.5 pl-12 pr-12 text-[0.9375rem] text-ink",
            "transition-[background-color,box-shadow] duration-300 ease-smooth",
            "placeholder:text-ink-mute focus:outline-none focus-visible:outline-none",
            surface === "well"
              ? "bg-base hover:bg-base focus:bg-base"
              : "bg-carbon hover:bg-steel focus:bg-steel",
            // Focus reads as the field lighting up from within, matching the
            // hover glow on the product tiles — not as an outline snapping on.
            "focus:shadow-[inset_0_0_0_1px_var(--turbo),0_0_0_4px_rgba(255,74,43,0.12)]",
          )}
        />

        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-ink-mute transition-colors duration-200 hover:bg-steel hover:text-ink"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="product-search-listbox"
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+10px)] z-50 max-h-[70vh] overflow-auto",
            "rounded-[1.375rem] bg-carbon p-2",
            // Both shadows must be ONE class: tailwind-merge treats
            // `shadow-lift` and `shadow-[inset…]` as the same utility group
            // and would keep only the last, dropping the drop shadow.
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_60px_-24px_rgba(0,0,0,0.9)]",
          )}
          style={{ animation: "rise .25s var(--ease-smooth) both" }}
        >
          {hits.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-ink-mute">
              No matches for{" "}
              <span className="font-semibold text-ink">“{value.trim()}”</span>
            </p>
          ) : (
            <ul>
              {hits.map((h, i) => (
                <li
                  key={h.product.id}
                  role="option"
                  aria-selected={i === active}
                >
                  <ResultRow
                    hit={h}
                    query={value}
                    active={i === active}
                    onHover={() => setActive(i)}
                    onClick={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ResultRow({
  hit,
  query,
  active,
  onHover,
  onClick,
}: {
  hit: SearchHit;
  query: string;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const p = hit.product;
  // Category labels are admin-editable rows now, so they come from the
  // taxonomy context rather than being passed down with the language.
  const { catLabel } = useTaxonomy();
  const { t } = useLanguage();

  return (
    <Link
      href={`/catalog/${p.id}`}
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 rounded-2xl p-2.5 transition-colors duration-200",
        active ? "bg-steel" : "hover:bg-steel",
      )}
    >
      {/* Same nested-radius treatment as the product tiles. */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          <Highlighted text={p.name} query={query} />
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-mute">
          {catLabel(p.category)}
          <span className="mx-1.5 text-ink-mute/50">·</span>
          <Highlighted text={p.code} query={query} />
        </p>
      </div>

      {typeof p.price === "number" ? (
        <span className="tnum shrink-0 text-sm font-semibold text-ink">
          {p.price.toLocaleString()}
          <span className="ml-1 text-xs font-medium text-ink-mute">GEL</span>
        </span>
      ) : (
        <span className="shrink-0 text-xs font-medium text-ink-mute">
          {t("product.priceOnRequest")}
        </span>
      )}
    </Link>
  );
}

export function Highlighted({ text, query }: { text: string; query: string }) {
  const segments = highlight(text, query);
  return (
    <>
      {segments.map((s, i) =>
        s.match ? (
          <mark key={i} className="rounded bg-turbo/25 px-0.5 text-inherit">
            {s.text}
          </mark>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-4 h-4 w-4 text-ink-mute transition-colors duration-300 group-focus-within:text-turbo"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
