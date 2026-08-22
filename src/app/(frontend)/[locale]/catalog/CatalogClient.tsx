"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { searchProducts } from "@/lib/product-search";
import { ProductSearch } from "@/components/ProductSearch";
import { ProductCard, ProductGrid } from "@/components/ProductCard";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import {
  Button,
  ButtonLink,
  ChipButton,
  MultiSelect,
  SelectMenu,
  TireTrack,
} from "@/components/Primitives";
import type { CatalogContent } from "@/lib/getCatalog";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";

const SORTS = ["FEATURED", "PRICE_ASC", "PRICE_DESC", "BOOST"] as const;
type Sort = (typeof SORTS)[number];

/** How long typing has to stop before the query is written to the URL. */
const SEARCH_DEBOUNCE_MS = 1000;

/* Both filters carry a taxonomy `value` ("BILLET", "BMW") — the stable key a
   product is filed under, which is also what goes in the URL. The options and
   their display labels are editable rows in /admin now (see
   src/lib/getTaxonomies.ts), so neither list can be a compile-time union any
   more; they arrive as props and every label is a lookup.

   There is deliberately no "ALL" member: an empty selection already means
   "no constraint", which is what lets the filters be multi-select without an
   ALL option fighting the others. */
type Cat = string;
type Veh = string;

/** Display label for a taxonomy value, e.g. "OEM REPLACEMENT" -> "OEM replacement". */
type Labeller = (value: string) => string;

/** Reads a comma-separated query param into a validated, de-duplicated list. */
function parseList<T extends string>(
  raw: string | null,
  allowed: readonly T[],
): T[] {
  if (!raw) return [];
  const wanted = new Set(raw.split(",").map((s) => s.trim()));
  // Iterating `allowed` (not `wanted`) both validates and gives a stable
  // order, so ?category=BILLET,HYBRID and ?category=HYBRID,BILLET produce
  // the same chips and the same canonical URL.
  return allowed.filter((a) => wanted.has(a));
}

function parseSort(v: string | null): Sort {
  return v === "PRICE_ASC" || v === "PRICE_DESC" || v === "BOOST"
    ? v
    : "FEATURED";
}

/** Adds or removes one value, preserving the canonical option order. */
function toggle<T extends string>(list: T[], value: T, allowed: readonly T[]) {
  const next = list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
  return allowed.filter((a) => next.includes(a));
}

export function CatalogClient({
  products,
  catalog,
}: {
  products: Product[];
  catalog: CatalogContent;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hero, search, toolbar, emptyState, customBuilds } = catalog;

  const {
    categories,
    vehicles,
    popularVehicles,
    catLabel,
    vehLabel,
  } = useTaxonomy();

  // The selectable values, in the order set by each collection's `order`
  // field. `parseList`/`toggle` both iterate these to validate and to keep a
  // canonical ordering, so ?category=BILLET,HYBRID and the reverse produce
  // identical chips and identical URLs.
  const catOptions = useMemo(
    () => categories.map((c) => c.value),
    [categories],
  );
  const vehOptions = useMemo(() => vehicles.map((v) => v.value), [vehicles]);

  const sortLabel = (s: Sort): string => {
    switch (s) {
      case "FEATURED":
        return toolbar.sortFeatured;
      case "PRICE_ASC":
        return toolbar.sortPriceAsc;
      case "PRICE_DESC":
        return toolbar.sortPriceDesc;
      case "BOOST":
        return toolbar.sortBoost;
    }
  };

  const q = searchParams.get("q") ?? "";
  const cats = parseList(searchParams.get("category"), catOptions);
  const vehs = parseList(searchParams.get("vehicle"), vehOptions);
  const sort = parseSort(searchParams.get("sort"));

  const [sheetOpen, setSheetOpen] = useState(false);

  // What's in the search field right now, which is NOT the same as what the
  // URL says — see the debounce below.
  const [draft, setDraft] = useState(q);

  const filtered = useMemo(() => {
    const base = products.filter(
      (p) =>
        // An empty list means "no constraint", not "match nothing".
        (cats.length === 0 || cats.includes(p.category)) &&
        (vehs.length === 0 || p.vehicles.some((v) => vehs.includes(v))),
    );
    let list = q.trim() ? searchProducts(q, base).map((h) => h.product) : base;
    // price/boost are optional per product. Sorting on a missing number
    // would scatter those units through the list, so they sink to the
    // bottom of every numeric sort instead, in their original order.
    const byNumber = (
      pick: (p: Product) => number | null | undefined,
      dir: 1 | -1,
    ) =>
      [...list].sort((a, b) => {
        const x = pick(a);
        const y = pick(b);
        if (typeof x !== "number") return typeof y !== "number" ? 0 : 1;
        if (typeof y !== "number") return -1;
        return (x - y) * dir;
      });
    if (sort === "PRICE_ASC") list = byNumber((p) => p.price, 1);
    if (sort === "PRICE_DESC") list = byNumber((p) => p.price, -1);
    if (sort === "BOOST") list = byNumber((p) => p.boost, -1);
    return list;
    // cats/vehs are fresh arrays each render; join() gives a stable dep.
  }, [products, q, cats.join(), vehs.join(), sort]);

  const update = (
    patch: Partial<{ q: string; cats: Cat[]; vehs: Veh[]; sort: Sort }>,
  ) => {
    const merged = { q, cats, vehs, sort, ...patch };
    const next = new URLSearchParams();
    if (merged.q) next.set("q", merged.q);
    if (merged.cats.length) next.set("category", merged.cats.join(","));
    if (merged.vehs.length) next.set("vehicle", merged.vehs.join(","));
    if (merged.sort !== "FEATURED") next.set("sort", merged.sort);
    const qs = next.toString();
    router.push(`/catalog${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  // ---- Search debounce -------------------------------------------------
  // /catalog is force-dynamic, so every `update` is a round trip to the
  // server. Committing the query per keystroke fired one request per
  // character typed. The field holds its own `draft` instead and the URL
  // only catches up once typing stops; the dropdown reads `draft` directly,
  // so suggestions still appear as fast as you type.
  //
  // `update` closes over the current filters, so a pending timer has to call
  // the NEWEST one — otherwise a chip toggled mid-word would be undone when
  // the timer fires with the filter state from before the click.
  const updateRef = useRef(update);
  updateRef.current = update;

  // Back/forward, "clear all", or landing on /catalog?q=… — the field has to
  // follow the URL when the change came from outside it.
  useEffect(() => setDraft(q), [q]);

  useEffect(() => {
    if (draft === q) return;
    // Emptying the field is a decision, not a pause: apply it immediately.
    const delay = draft.trim() === "" ? 0 : SEARCH_DEBOUNCE_MS;
    const timer = setTimeout(() => updateRef.current({ q: draft }), delay);
    return () => clearTimeout(timer);
  }, [draft, q]);

  // Enter shouldn't make you sit out the debounce.
  const submitSearch = (next: string) => {
    setDraft(next);
    updateRef.current({ q: next });
  };

  const toggleCat = (c: Cat) => update({ cats: toggle(cats, c, catOptions) });
  const toggleVeh = (v: Veh) => update({ vehs: toggle(vehs, v, vehOptions) });
  const clearAll = () => update({ q: "", cats: [], vehs: [] });

  const filterCount = cats.length + vehs.length;
  const hasAny = filterCount > 0 || q.trim() !== "";

  return (
    <>
      <SiteHeader />

      <main className="shell">
        <header className="pb-10 pt-8 md:pb-12 md:pt-12">
          <h1 className="max-w-3xl text-[clamp(2.25rem,5.5vw,4rem)] font-bold">
            {hero.titleLine1}{" "}
            <span className="text-turbo">
              {hero.titleLine2}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {hero.blurb}
          </p>
        </header>

        {/* ---- Control panel -------------------------------------------
            Search and both filter rows live in ONE surface, so finding a
            product reads as a single task instead of three stacked bars.
            The field is a "well" — a step darker than the panel — the same
            nesting the product tiles use for their images.

            Filter rows are desktop-only; on phones the sticky toolbar below
            opens them as a sheet. */}
        <div className="rounded-[1.375rem] bg-graphite p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] md:p-5">
          <ProductSearch
            value={draft}
            surface="well"
            onChange={setDraft}
            onSubmit={submitSearch}
            placeholder={search.placeholder}
          />

          <div className="mt-4 hidden items-center gap-2.5 lg:flex">
            <MultiSelect
              label={toolbar.categoryLabel}
              options={catOptions}
              selected={cats}
              renderOption={catLabel}
              onToggle={toggleCat}
              onClear={() => update({ cats: [] })}
              allLabel={toolbar.allOption}
              className="w-52"
            />
            <MultiSelect
              label={toolbar.vehicleLabel}
              options={vehOptions}
              selected={vehs}
              renderOption={vehLabel}
              onToggle={toggleVeh}
              onClear={() => update({ vehs: [] })}
              allLabel={toolbar.allOption}
              className="w-52"
            />

            {filterCount > 0 && (
              <button
                onClick={() => update({ cats: [], vehs: [] })}
                className="ml-1 text-sm font-semibold text-ink-mute transition-colors hover:text-turbo"
              >
                {toolbar.clearAll}
              </button>
            )}
          </div>
        </div>

        {/* ---- Results toolbar -----------------------------------------
            min-w-0 on the flex children is what stops a long sort label
            ("Price: low to high") from forcing the bar wider than the
            viewport on a narrow phone — flex items default to min-width:auto
            and refuse to shrink below their content. */}
        <div className="sticky top-18 z-30 -mx-1 flex items-center gap-2 bg-base/90 px-1 py-3 backdrop-blur-xl sm:gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="shrink-0 lg:hidden"
          >
            {toolbar.filtersLabel}
            {filterCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-turbo-deep px-1.5 text-[0.6875rem] text-white">
                {filterCount}
              </span>
            )}
          </Button>

          <p className="tnum min-w-0 truncate text-sm text-ink-mute">
            {filtered.length} {toolbar.unitsSuffix}
          </p>

          <SelectMenu
            ariaLabel={toolbar.sortLabel}
            prefix={toolbar.sortLabel}
            value={sort}
            options={SORTS}
            renderOption={(s) => sortLabel(s)}
            onChange={(s) => update({ sort: s })}
            align="right"
            className="ml-auto min-w-0 shrink"
          />
        </div>

        {/* ---- Applied filters ------------------------------------------ */}
        {hasAny && (
          <div className="flex flex-wrap items-center gap-2">
            {q.trim() !== "" && (
              <AppliedChip
                label={`“${q.trim()}”`}
                onClear={() => update({ q: "" })}
              />
            )}
            {cats.map((c) => (
              <AppliedChip
                key={c}
                label={catLabel(c)}
                onClear={() => toggleCat(c)}
              />
            ))}
            {vehs.map((v) => (
              <AppliedChip
                key={v}
                label={vehLabel(v)}
                onClear={() => toggleVeh(v)}
              />
            ))}
            <button
              onClick={clearAll}
              className="ml-1 text-sm font-semibold text-turbo transition-colors hover:text-ember"
            >
              {toolbar.clearAll}
            </button>
          </div>
        )}

        <section className="pb-8 pt-8">
          {filtered.length === 0 ? (
            <EmptyState
              emptyState={emptyState}
              query={q}
              cats={cats}
              vehs={vehs}
              catOptions={catOptions}
              popularVehicles={popularVehicles.map((v) => v.value)}
              catLabel={catLabel}
              vehLabel={vehLabel}
              onReset={clearAll}
              onPickCategory={(c) => update({ q: "", cats: [c], vehs: [] })}
              onPickVehicle={(v) => update({ q: "", cats: [], vehs: [v] })}
            />
          ) : (
            <ProductGrid>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} query={q} priority={i < 4} />
              ))}
            </ProductGrid>
          )}
        </section>

        <TireTrack className="my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />

        <section className="mb-4 rounded-[2rem] bg-graphite px-6 py-14 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <p className="eyebrow">
                {customBuilds.kicker}
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                {customBuilds.title1}{" "}
                <span className="text-turbo">
                  {customBuilds.title2}
                </span>
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                {customBuilds.blurb}
              </p>
            </div>
            <ButtonLink href="/contact" className="shrink-0">
              {customBuilds.ctaLabel}
            </ButtonLink>
          </div>
        </section>
      </main>

      {sheetOpen && (
        <FilterSheet
          toolbar={toolbar}
          cats={cats}
          vehs={vehs}
          catOptions={catOptions}
          vehOptions={vehOptions}
          catLabel={catLabel}
          vehLabel={vehLabel}
          resultCount={filtered.length}
          onToggleCat={toggleCat}
          onToggleVeh={toggleVeh}
          onClearCats={() => update({ cats: [] })}
          onClearVehs={() => update({ vehs: [] })}
          onClearAll={clearAll}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <SiteFooter />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function AppliedChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-carbon py-1.5 pl-3.5 pr-2 text-[0.8125rem] font-semibold text-ink">
      {label}
      <button
        onClick={onClear}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-steel hover:text-ink"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-2.5 w-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </span>
  );
}

/* Mobile filter sheet. Filters apply live as they're tapped — the footer
   button just dismisses and reports the count, so there is no "apply" step
   to forget and no draft state to keep in sync with the URL. */
function FilterSheet({
  toolbar,
  cats,
  vehs,
  catOptions,
  vehOptions,
  catLabel,
  vehLabel,
  resultCount,
  onToggleCat,
  onToggleVeh,
  onClearCats,
  onClearVehs,
  onClearAll,
  onClose,
}: {
  toolbar: CatalogContent["toolbar"];
  cats: Cat[];
  vehs: Veh[];
  catOptions: Cat[];
  vehOptions: Veh[];
  catLabel: Labeller;
  vehLabel: Labeller;
  resultCount: number;
  onToggleCat: (c: Cat) => void;
  onToggleVeh: (v: Veh) => void;
  onClearCats: () => void;
  onClearVehs: () => void;
  onClearAll: () => void;
  onClose: () => void;
}) {

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-base/80 backdrop-blur-sm lg:hidden"
      style={{ animation: "rise .3s var(--ease-smooth) both" }}
      role="dialog"
      aria-modal="true"
      aria-label={toolbar.filtersLabel}
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-graphite"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-graphite/95 px-5 pb-3 pt-3 backdrop-blur">
          {/* Grab handle — the affordance that says "this drags/dismisses". */}
          <div
            aria-hidden
            className="mx-auto mb-4 h-1 w-10 rounded-full bg-steel"
          />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">
              {toolbar.filtersLabel}
            </h2>
            <button
              onClick={onClearAll}
              className="text-sm font-semibold text-turbo"
            >
              {toolbar.clearAll}
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <SheetGroup
            label={toolbar.categoryLabel}
            allLabel={toolbar.allOption}
            allActive={cats.length === 0}
            onAll={onClearCats}
          >
            {catOptions.map((c) => (
              <ChipButton
                key={c}
                active={cats.includes(c)}
                onClick={() => onToggleCat(c)}
              >
                {catLabel(c)}
              </ChipButton>
            ))}
          </SheetGroup>

          <SheetGroup
            label={toolbar.vehicleLabel}
            allLabel={toolbar.allOption}
            allActive={vehs.length === 0}
            onAll={onClearVehs}
          >
            {vehOptions.map((v) => (
              <ChipButton
                key={v}
                active={vehs.includes(v)}
                onClick={() => onToggleVeh(v)}
              >
                {vehLabel(v)}
              </ChipButton>
            ))}
          </SheetGroup>
        </div>

        <div className="sticky bottom-0 bg-graphite/95 px-5 pb-6 pt-3 backdrop-blur">
          <Button onClick={onClose} className="w-full">
            {toolbar.showResults} ({resultCount})
          </Button>
        </div>
      </div>
    </div>
  );
}

function SheetGroup({
  label,
  allLabel,
  allActive,
  onAll,
  children,
}: {
  label: string;
  allLabel: string;
  allActive: boolean;
  onAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-6">
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        <ChipButton active={allActive} onClick={onAll}>
          {allLabel}
        </ChipButton>
        {children}
      </div>
    </div>
  );
}

function EmptyState({
  emptyState,
  query,
  cats,
  vehs,
  catOptions,
  popularVehicles,
  catLabel,
  vehLabel,
  onReset,
  onPickCategory,
  onPickVehicle,
}: {
  emptyState: CatalogContent["emptyState"];
  query: string;
  cats: Cat[];
  vehs: Veh[];
  catOptions: Cat[];
  popularVehicles: Veh[];
  catLabel: Labeller;
  vehLabel: Labeller;
  onReset: () => void;
  onPickCategory: (c: Cat) => void;
  onPickVehicle: (v: Veh) => void;
}) {
  const term =
    query || [...cats.map(catLabel), ...vehs.map(vehLabel)].join(" + ");

  return (
    <div className="rounded-[2rem] bg-graphite px-6 py-16 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]">
          {emptyState.title}
        </h2>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          {emptyState.blurbLead}{" "}
          <span className="font-semibold text-ink">“{term}”</span>{" "}
          {emptyState.blurbTail}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={onReset}>
            {emptyState.resetFilter}
          </Button>
          <ButtonLink href="/contact">
            {emptyState.requestCustomSpec}
          </ButtonLink>
        </div>

        <div className="mt-14">
          <p className="eyebrow mb-4">
            {emptyState.browseCore}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {catOptions.map((c) => (
              <ChipButton key={c} onClick={() => onPickCategory(c)}>
                {catLabel(c)}
              </ChipButton>
            ))}
          </div>

          <p className="eyebrow mb-4 mt-8">
            {emptyState.popularPlatforms}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {/* Which makes count as "popular" is a checkbox on each vehicle
                row in /admin, not a hardcoded list. */}
            {popularVehicles.map((v) => (
              <ChipButton key={v} onClick={() => onPickVehicle(v)}>
                {vehLabel(v)}
              </ChipButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
