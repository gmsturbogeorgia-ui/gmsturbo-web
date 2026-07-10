"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  VEHICLES,
  PRODUCTS,
  type Category,
  type Vehicle,
  type Product,
} from "@/lib/products";
import { searchProducts } from "@/lib/product-search";
import { ProductSearch, Highlighted } from "@/components/ProductSearch";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";
import { categoryLabel, stockLabel } from "@/lib/i18n/dictionary";

type Sort = "FEATURED" | "PRICE_ASC" | "PRICE_DESC" | "BOOST";

const BROWSE_CATEGORIES = [
  { name: "HYBRID", desc: "Response & street", descKa: "გამოხმაურება და ქუჩა" },
  {
    name: "BILLET",
    label: "BILLET PRO",
    desc: "Billet wheel specs",
    descKa: "ბილეტის ბორბლის სპეციფიკაცია",
  },
  {
    name: "COMPETITION",
    desc: "Extreme boost setups",
    descKa: "ექსტრემალური ბუსტის კონფიგურაცია",
  },
  {
    name: "OEM REPLACEMENT",
    label: "OEM CLASS",
    desc: "Direct replacement",
    descKa: "პირდაპირი ჩანაცვლება",
  },
] as const;

function parseCategory(v: string | null): Category {
  return (CATEGORIES as readonly string[]).includes(v ?? "")
    ? (v as Category)
    : "ALL";
}
function parseVehicle(v: string | null): Vehicle {
  return (VEHICLES as readonly string[]).includes(v ?? "")
    ? (v as Vehicle)
    : "ALL";
}
function parseSort(v: string | null): Sort {
  return v === "PRICE_ASC" || v === "PRICE_DESC" || v === "BOOST"
    ? v
    : "FEATURED";
}

export function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const q = searchParams.get("q") ?? "";
  const category = parseCategory(searchParams.get("category"));
  const vehicle = parseVehicle(searchParams.get("vehicle"));
  const sort = parseSort(searchParams.get("sort"));

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = PRODUCTS.filter(
      (p) =>
        (category === "ALL" || p.category === category) &&
        (vehicle === "ALL" ||
          p.vehicles.includes(vehicle as Exclude<Vehicle, "ALL">)),
    );
    let list = q.trim() ? searchProducts(q, base).map((h) => h.product) : base;
    if (sort === "PRICE_ASC")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "PRICE_DESC")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "BOOST") list = [...list].sort((a, b) => b.boost - a.boost);
    return list;
  }, [q, category, vehicle, sort]);

  const update = (
    patch: Partial<{
      q: string;
      category: Category;
      vehicle: Vehicle;
      sort: Sort;
    }>,
  ) => {
    const next = new URLSearchParams(searchParams.toString());
    const merged = { q, category, vehicle, sort, ...patch };
    if (merged.q) next.set("q", merged.q);
    else next.delete("q");
    if (merged.category !== "ALL") next.set("category", merged.category);
    else next.delete("category");
    if (merged.vehicle !== "ALL") next.set("vehicle", merged.vehicle);
    else next.delete("vehicle");
    if (merged.sort !== "FEATURED") next.set("sort", merged.sort);
    else next.delete("sort");
    const qs = next.toString();
    router.push(`/catalog${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-end gap-4 px-6 py-12 md:py-16">
          <div className="min-w-0">
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / {t("product.catalog")} — {filtered.length} {t("catalog.unitsSuffix")}
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-tight">
              {t("catalog.titleLine1")}
              <br />
              <span className="text-turbo">{t("catalog.titleLine2")}</span>
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted-foreground md:block">
            {t("catalog.blurb")}
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-graphite/40">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <ProductSearch
            value={q}
            onChange={(next) => update({ q: next })}
            placeholder={t("catalog.searchPlaceholder")}
          />
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] tracking-widest lg:hidden"
          >
            <span>{t("catalog.filters")}</span>
            <span className="text-turbo">
              ({(category !== "ALL" ? 1 : 0) + (vehicle !== "ALL" ? 1 : 0)})
            </span>
          </button>

          <div className="hidden flex-1 items-center gap-8 lg:flex">
            <FilterRow
              label={t("catalog.category")}
              options={CATEGORIES}
              value={category}
              onChange={(v) => update({ category: v as Category })}
              lang={lang}
              translate={categoryLabel}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden font-mono text-[10px] tracking-widest text-muted-foreground sm:block">
              {t("catalog.sort")}
            </label>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as Sort })}
              className="border border-border bg-background px-3 py-2 font-mono text-[11px] tracking-widest text-foreground focus:border-turbo focus:outline-none"
            >
              <option value="FEATURED">{t("catalog.sortFeatured")}</option>
              <option value="PRICE_ASC">{t("catalog.sortPriceAsc")}</option>
              <option value="PRICE_DESC">{t("catalog.sortPriceDesc")}</option>
              <option value="BOOST">{t("catalog.sortBoost")}</option>
            </select>
          </div>
        </div>

        <div className="hidden border-t border-border lg:block">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-3">
            <span className="mr-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("catalog.vehicle")}
            </span>
            <div className="flex flex-wrap gap-2">
              {VEHICLES.map((v) => (
                <button
                  key={v}
                  onClick={() => update({ vehicle: v })}
                  className={`px-3 py-1.5 font-mono text-[10px] tracking-widest transition-colors ${
                    vehicle === v
                      ? "bg-turbo text-white"
                      : "border border-border text-muted-foreground hover:border-turbo hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="border-t border-border bg-graphite px-6 py-5 lg:hidden">
            <div className="mb-5">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("catalog.category")}
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ category: c })}
                    className={`px-3 py-1.5 font-mono text-[10px] tracking-widest ${
                      category === c
                        ? "bg-turbo text-white"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {categoryLabel(c, lang)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("catalog.vehicle")}
              </p>
              <div className="flex flex-wrap gap-2">
                {VEHICLES.map((v) => (
                  <button
                    key={v}
                    onClick={() => update({ vehicle: v })}
                    className={`px-3 py-1.5 font-mono text-[10px] tracking-widest ${
                      vehicle === v
                        ? "bg-turbo text-white"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {(q.trim() !== "" || category !== "ALL" || vehicle !== "ALL") && (
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 py-3">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("catalog.active")}
            </span>
            {q.trim() !== "" && (
              <Chip label={`"${q.trim()}"`} onClear={() => update({ q: "" })} />
            )}
            {category !== "ALL" && (
              <Chip
                label={categoryLabel(category, lang)}
                onClear={() => update({ category: "ALL" })}
              />
            )}
            {vehicle !== "ALL" && (
              <Chip label={vehicle} onClear={() => update({ vehicle: "ALL" })} />
            )}
            <button
              onClick={() => update({ q: "", category: "ALL", vehicle: "ALL" })}
              className="ml-2 font-mono text-[10px] tracking-widest text-turbo hover:text-ember"
            >
              {t("catalog.clearAll")}
            </button>
          </div>
        </div>
      )}

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          {filtered.length === 0 ? (
            <div className="relative border border-dashed border-border/60 bg-gradient-to-b from-graphite/10 to-transparent py-16 md:py-24">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] opacity-5" />

              <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
                <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-border bg-background/50 backdrop-blur-sm">
                  <div className="absolute -left-1 -right-1 h-px bg-turbo/40" />
                  <div className="absolute -top-1 -bottom-1 w-px bg-turbo/40" />
                  <span className="font-mono text-xs font-bold tracking-widest text-turbo">
                    0.00%
                  </span>
                </div>

                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-turbo">
                  {t("catalog.noResultsKicker")}
                </p>
                <h2 className="mt-2 font-display text-4xl uppercase tracking-tight md:text-5xl">
                  {t("catalog.noResultsTitle")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t("catalog.noResultsBlurbLead")}{" "}
                  <span className="bg-graphite px-1.5 py-0.5 font-mono text-foreground">
                    &quot;{q || category + " + " + vehicle}&quot;
                  </span>{" "}
                  {t("catalog.noResultsBlurbTail")}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() =>
                      update({ q: "", category: "ALL", vehicle: "ALL" })
                    }
                    className="border border-border bg-background px-6 py-3 font-heading text-[11px] tracking-[0.2em] text-foreground transition-all hover:border-turbo hover:text-turbo"
                  >
                    {t("catalog.resetFilter")}
                  </button>
                  <Link
                    href="/contact"
                    className="border border-turbo bg-turbo px-6 py-3 font-heading text-[11px] tracking-[0.2em] text-white transition-all hover:bg-ember"
                  >
                    {t("catalog.requestCustomSpec")}
                  </Link>
                </div>

                <div className="mt-16 border-t border-border pt-12">
                  <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    {t("catalog.browseCore")}
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {BROWSE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() =>
                          update({
                            q: "",
                            category: cat.name as Category,
                            vehicle: "ALL",
                          })
                        }
                        className="group flex flex-col items-start border border-border bg-background p-4 text-left transition-all hover:border-turbo"
                      >
                        <span className="font-mono text-[11px] tracking-widest text-foreground group-hover:text-turbo">
                          {"label" in cat && cat.label
                            ? cat.label
                            : categoryLabel(cat.name, lang)}
                        </span>
                        <span className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
                          {lang === "KA" ? cat.descKa : cat.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {t("catalog.popularPlatforms")}
                    </span>
                    {["BMW", "AUDI", "PORSCHE", "MERCEDES"].map((v) => (
                      <button
                        key={v}
                        onClick={() =>
                          update({ q: "", vehicle: v as Vehicle, category: "ALL" })
                        }
                        className="border border-border bg-background/40 px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:border-turbo hover:text-foreground"
                      >
                        {v} SERIES
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} query={q} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-graphite">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-[1.4fr_auto]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("catalog.customBuilds")}
            </p>
            <h2 className="font-display text-4xl leading-[0.95] md:text-5xl">
              {t("catalog.cantFind1")}{" "}
              <span className="text-turbo">{t("catalog.cantFind2")}</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {t("catalog.customBlurb")}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white hover:bg-ember"
          >
            {t("catalog.requestQuote")}
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  lang,
  translate,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  lang: "EN" | "KA";
  translate: (v: string, lang: "EN" | "KA") => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-3 py-1.5 font-mono text-[10px] tracking-widest transition-colors ${
              value === o
                ? "bg-turbo text-white"
                : "border border-border text-muted-foreground hover:border-turbo hover:text-foreground"
            }`}
          >
            {translate(o, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 border border-turbo px-3 py-1 font-mono text-[10px] tracking-widest text-foreground">
      {label}
      <button
        onClick={onClear}
        className="text-turbo hover:text-ember"
        aria-label={`Remove ${label}`}
      >
        ✕
      </button>
    </span>
  );
}

function ProductCard({
  product,
  index,
  query,
}: {
  product: Product;
  index: number;
  query: string;
}) {
  const { t, lang } = useLanguage();
  const stockColor =
    product.stock === "IN STOCK"
      ? "text-foreground"
      : product.stock === "LOW STOCK"
        ? "text-ember"
        : "text-muted-foreground";
  return (
    <Link
      href={`/catalog/${product.id}`}
      className="group relative block bg-background transition-colors hover:bg-carbon"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 bg-turbo px-2.5 py-1 font-mono text-[10px] tracking-widest text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`absolute right-4 top-4 border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] tracking-widest backdrop-blur ${stockColor}`}
        >
          {stockLabel(product.stock, lang)}
        </span>
        <span className="absolute bottom-4 right-4 translate-y-2 bg-turbo px-3 py-1.5 font-mono text-[10px] tracking-widest text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {t("common.viewDetail")}
        </span>
      </div>

      <div className="border-t border-border p-5">
        <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground">
          <Highlighted
            text={`${product.code} · ${categoryLabel(product.category, lang)}`}
            query={query}
          />
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-display text-xl leading-tight tracking-wide">
            <Highlighted text={product.name} query={query} />
          </h3>
          <p className="shrink-0 font-display text-2xl text-turbo">
            {product.price.toLocaleString()} <span className="text-sm">GEL</span>
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-px bg-border">
          <Spec label="BOOST" value={`${product.boost} PSI`} />
          <Spec label="HP+" value={`${product.hp}`} />
          <Spec
            label={t("catalog.fits")}
            value={`${product.vehicles.length} ${t("catalog.platforms")}`}
          />
        </dl>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {product.vehicles.map((v) => (
            <span
              key={v}
              className="border border-border px-2 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background px-3 py-3">
      <dt className="font-mono text-[9px] tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-base leading-none">{value}</dd>
    </div>
  );
}
