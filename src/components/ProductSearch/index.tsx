"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  highlight,
  searchProducts,
  type SearchHit,
} from "@/lib/product-search";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: (next: string) => void;
  placeholder?: string;
  maxResults?: number;
};

export function ProductSearch({
  value,
  onChange,
  onSubmit,
  placeholder = "Search turbos, codes, vehicles, specs…",
  maxResults = 6,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(
    () => (value.trim() ? searchProducts(value).slice(0, maxResults) : []),
    [value, maxResults],
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
      <div className="relative flex items-center">
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
                window.location.assign(`/catalog/${hits[active].product.id}`);
              } else {
                onSubmit?.(value);
                setOpen(false);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          className="w-full border border-border bg-background py-2.5 pl-10 pr-10 font-mono text-[12px] tracking-wide text-foreground placeholder:text-muted-foreground focus:border-turbo focus:outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 text-muted-foreground hover:text-turbo"
          >
            <span className="font-mono text-xs">✕</span>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="product-search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[70vh] overflow-auto border border-border bg-background shadow-2xl"
        >
          {hits.length === 0 ? (
            <div className="px-4 py-6 text-center font-mono text-[11px] tracking-widest text-muted-foreground">
              NO MATCHES FOR "{value.trim().toUpperCase()}"
            </div>
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
              <li className="border-t border-border bg-graphite/40 px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                ↑↓ NAVIGATE · ↵ OPEN · ESC CLOSE
              </li>
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
  const snippet = hit.matched.find(
    (m) => m.field !== "name" && m.field !== "code" && m.field !== "category",
  );

  return (
    <Link
      href={`/catalog/${p.id}`}
      onMouseEnter={onHover}
      onClick={onClick}
      className={`flex items-stretch gap-4 border-b border-border px-4 py-3 transition-colors ${
        active ? "bg-carbon" : "hover:bg-carbon"
      }`}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden bg-graphite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-display text-base leading-tight tracking-wide">
            <Highlighted text={p.name} query={query} />
          </p>
          <span className="shrink-0 font-display text-sm text-turbo">
            {p.price.toLocaleString()} GEL
          </span>
        </div>
        <p className="mt-1 truncate font-mono text-[10px] tracking-widest text-muted-foreground">
          <Highlighted
            text={`${p.code} · ${p.category} · ${p.vehicles.join(" / ")}`}
            query={query}
          />
        </p>
        {snippet && (
          <p className="mt-1 line-clamp-1 font-mono text-[10px] tracking-wide text-muted-foreground/80">
            <Highlighted text={snippet.text} query={query} />
          </p>
        )}
      </div>
    </Link>
  );
}

export function Highlighted({ text, query }: { text: string; query: string }) {
  const segments = highlight(text, query);
  return (
    <>
      {segments.map((s, i) =>
        s.match ? (
          <mark key={i} className="bg-turbo/30 px-0.5 text-foreground">
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
      className="absolute left-3 h-4 w-4 text-muted-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
