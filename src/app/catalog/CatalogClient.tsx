"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  VEHICLES,
  type Category,
  type Vehicle,
  type Product,
} from "@/lib/products";
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
} from "@/components/Primitives";
import { useLanguage } from "@/lib/i18n/context";
import { categoryLabel, vehicleLabel } from "@/lib/i18n/dictionary";

const SORTS = ["FEATURED", "PRICE_ASC", "PRICE_DESC", "BOOST"] as const;
type Sort = (typeof SORTS)[number];

const SORT_KEYS: Record<Sort, string> = {
  FEATURED: "catalog.sortFeatured",
  PRICE_ASC: "catalog.sortPriceAsc",
  PRICE_DESC: "catalog.sortPriceDesc",
  BOOST: "catalog.sortBoost",
};

/* "ALL" is a UI affordance, not a value — it just means "nothing selected".
   Keeping it out of the selectable lists is what lets the filters be
   multi-select without ALL fighting the other options. */
type Cat = Exclude<Category, "ALL">;
type Veh = Exclude<Vehicle, "ALL">;

const CAT_OPTIONS = CATEGORIES.filter((c): c is Cat => c !== "ALL");
const VEH_OPTIONS = VEHICLES.filter((v): v is Veh => v !== "ALL");

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

export function CatalogClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const q = searchParams.get("q") ?? "";
  const cats = parseList(searchParams.get("category"), CAT_OPTIONS);
  const vehs = parseList(searchParams.get("vehicle"), VEH_OPTIONS);
  const sort = parseSort(searchParams.get("sort"));

  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = products.filter(
      (p) =>
        // An empty list means "no constraint", not "match nothing".
        (cats.length === 0 || cats.includes(p.category)) &&
        (vehs.length === 0 || p.vehicles.some((v) => vehs.includes(v))),
    );
    let list = q.trim() ? searchProducts(q, base).map((h) => h.product) : base;
    if (sort === "PRICE_ASC") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "PRICE_DESC")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "BOOST") list = [...list].sort((a, b) => b.boost - a.boost);
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

  const toggleCat = (c: Cat) =>
    update({ cats: toggle(cats, c, CAT_OPTIONS) });
  const toggleVeh = (v: Veh) =>
    update({ vehs: toggle(vehs, v, VEH_OPTIONS) });
  const clearAll = () => update({ q: "", cats: [], vehs: [] });

  const filterCount = cats.length + vehs.length;
  const hasAny = filterCount > 0 || q.trim() !== "";

  return (
    <>
      <SiteHeader />

      <main className="shell">
        <header className="pb-10 pt-8 md:pb-12 md:pt-12">
          <h1 className="max-w-3xl text-[clamp(2.25rem,5.5vw,4rem)] font-bold">
            {t("catalog.titleLine1")}{" "}
            <span className="text-turbo">{t("catalog.titleLine2")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {t("catalog.blurb")}
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
            value={q}
            surface="well"
            onChange={(next) => update({ q: next })}
            placeholder={t("catalog.searchPlaceholder")}
          />

          <div className="mt-4 hidden items-center gap-2.5 lg:flex">
            <MultiSelect
              label={t("catalog.category")}
              options={CAT_OPTIONS}
              selected={cats}
              renderOption={(c) => categoryLabel(c, lang)}
              onToggle={toggleCat}
              onClear={() => update({ cats: [] })}
              allLabel={t("catalog.allOption")}
              className="w-52"
            />
            <MultiSelect
              label={t("catalog.vehicle")}
              options={VEH_OPTIONS}
              selected={vehs}
              renderOption={(v) => vehicleLabel(v, lang)}
              onToggle={toggleVeh}
              onClear={() => update({ vehs: [] })}
              allLabel={t("catalog.allOption")}
              className="w-52"
            />

            {filterCount > 0 && (
              <button
                onClick={() => update({ cats: [], vehs: [] })}
                className="ml-1 text-sm font-semibold text-ink-mute transition-colors hover:text-turbo"
              >
                {t("catalog.clearAll")}
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
            {t("catalog.filters")}
            {filterCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-turbo-deep px-1.5 text-[0.6875rem] text-white">
                {filterCount}
              </span>
            )}
          </Button>

          <p className="tnum min-w-0 truncate text-sm text-ink-mute">
            {filtered.length} {t("catalog.unitsSuffix")}
          </p>

          <SelectMenu
            ariaLabel={t("catalog.sort")}
            prefix={t("catalog.sort")}
            value={sort}
            options={SORTS}
            renderOption={(s) => t(SORT_KEYS[s])}
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
                label={categoryLabel(c, lang)}
                onClear={() => toggleCat(c)}
              />
            ))}
            {vehs.map((v) => (
              <AppliedChip
                key={v}
                label={vehicleLabel(v, lang)}
                onClear={() => toggleVeh(v)}
              />
            ))}
            <button
              onClick={clearAll}
              className="ml-1 text-sm font-semibold text-turbo transition-colors hover:text-ember"
            >
              {t("catalog.clearAll")}
            </button>
          </div>
        )}

        <section className="pb-8 pt-8">
          {filtered.length === 0 ? (
            <EmptyState
              query={q}
              cats={cats}
              vehs={vehs}
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

        <section className="mb-4 rounded-[2rem] bg-graphite px-6 py-14 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <p className="eyebrow">{t("catalog.customBuilds")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">
                {t("catalog.cantFind1")}{" "}
                <span className="text-turbo">{t("catalog.cantFind2")}</span>
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                {t("catalog.customBlurb")}
              </p>
            </div>
            <ButtonLink href="/contact" className="shrink-0">
              {t("catalog.requestQuote")}
            </ButtonLink>
          </div>
        </section>
      </main>

      {sheetOpen && (
        <FilterSheet
          cats={cats}
          vehs={vehs}
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
  cats,
  vehs,
  resultCount,
  onToggleCat,
  onToggleVeh,
  onClearCats,
  onClearVehs,
  onClearAll,
  onClose,
}: {
  cats: Cat[];
  vehs: Veh[];
  resultCount: number;
  onToggleCat: (c: Cat) => void;
  onToggleVeh: (v: Veh) => void;
  onClearCats: () => void;
  onClearVehs: () => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  const { t, lang } = useLanguage();

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
      aria-label={t("catalog.filters")}
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
              {t("catalog.filters")}
            </h2>
            <button
              onClick={onClearAll}
              className="text-sm font-semibold text-turbo"
            >
              {t("catalog.clearAll")}
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <SheetGroup
            label={t("catalog.category")}
            allActive={cats.length === 0}
            onAll={onClearCats}
          >
            {CAT_OPTIONS.map((c) => (
              <ChipButton
                key={c}
                active={cats.includes(c)}
                onClick={() => onToggleCat(c)}
              >
                {categoryLabel(c, lang)}
              </ChipButton>
            ))}
          </SheetGroup>

          <SheetGroup
            label={t("catalog.vehicle")}
            allActive={vehs.length === 0}
            onAll={onClearVehs}
          >
            {VEH_OPTIONS.map((v) => (
              <ChipButton
                key={v}
                active={vehs.includes(v)}
                onClick={() => onToggleVeh(v)}
              >
                {vehicleLabel(v, lang)}
              </ChipButton>
            ))}
          </SheetGroup>
        </div>

        <div className="sticky bottom-0 bg-graphite/95 px-5 pb-6 pt-3 backdrop-blur">
          <Button onClick={onClose} className="w-full">
            {t("catalog.showResults")} ({resultCount})
          </Button>
        </div>
      </div>
    </div>
  );
}

function SheetGroup({
  label,
  allActive,
  onAll,
  children,
}: {
  label: string;
  allActive: boolean;
  onAll: () => void;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="pt-6">
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        <ChipButton active={allActive} onClick={onAll}>
          {t("catalog.allOption")}
        </ChipButton>
        {children}
      </div>
    </div>
  );
}

function EmptyState({
  query,
  cats,
  vehs,
  onReset,
  onPickCategory,
  onPickVehicle,
}: {
  query: string;
  cats: Cat[];
  vehs: Veh[];
  onReset: () => void;
  onPickCategory: (c: Cat) => void;
  onPickVehicle: (v: Veh) => void;
}) {
  const { t, lang } = useLanguage();
  const term =
    query ||
    [...cats.map((c) => categoryLabel(c, lang)), ...vehs.map((v) => vehicleLabel(v, lang))].join(
      " + ",
    );

  return (
    <div className="rounded-[2rem] bg-graphite px-6 py-16 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]">
          {t("catalog.noResultsTitle")}
        </h2>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          {t("catalog.noResultsBlurbLead")}{" "}
          <span className="font-semibold text-ink">“{term}”</span>{" "}
          {t("catalog.noResultsBlurbTail")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={onReset}>
            {t("catalog.resetFilter")}
          </Button>
          <ButtonLink href="/contact">
            {t("catalog.requestCustomSpec")}
          </ButtonLink>
        </div>

        <div className="mt-14">
          <p className="eyebrow mb-4">{t("catalog.browseCore")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CAT_OPTIONS.map((c) => (
              <ChipButton key={c} onClick={() => onPickCategory(c)}>
                {categoryLabel(c, lang)}
              </ChipButton>
            ))}
          </div>

          <p className="eyebrow mb-4 mt-8">{t("catalog.popularPlatforms")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {(["BMW", "AUDI", "PORSCHE", "MERCEDES"] as const).map((v) => (
              <ChipButton key={v} onClick={() => onPickVehicle(v)}>
                {vehicleLabel(v, lang)}
              </ChipButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
