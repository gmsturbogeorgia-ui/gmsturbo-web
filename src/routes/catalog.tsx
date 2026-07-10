import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
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

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.enum(CATEGORIES), "ALL").default("ALL"),
  vehicle: fallback(z.enum(VEHICLES), "ALL").default("ALL"),
  sort: fallback(
    z.enum(["FEATURED", "PRICE_ASC", "PRICE_DESC", "BOOST"]),
    "FEATURED",
  ).default("FEATURED"),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Turbocharger Catalog — GMS Turbo Georgia" },
      {
        name: "description",
        content:
          "Browse premium turbochargers by vehicle compatibility, category and performance specs. Hybrid, billet, OEM and competition turbos in stock in Tbilisi.",
      },
      {
        property: "og:title",
        content: "Turbocharger Catalog — GMS Turbo Georgia",
      },
      {
        property: "og:description",
        content:
          "Hybrid, billet, OEM and competition-grade turbochargers in stock in Tbilisi.",
      },
      { property: "og:url", content: "/catalog" },
      { property: "og:image", content: "/og-catalog.jpg" },
      {
        name: "twitter:title",
        content: "Turbocharger Catalog — GMS Turbo Georgia",
      },
      {
        name: "twitter:description",
        content: "Premium turbochargers filtered by vehicle and category.",
      },
      { name: "twitter:image", content: "/og-catalog.jpg" },
    ],
    links: [{ rel: "canonical", href: "/catalog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Turbocharger Catalog",
          url: "/catalog",
          about: "Premium turbochargers — hybrid, billet, OEM, competition.",
          numberOfItems: PRODUCTS.length,
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Catalog",
                item: "/catalog",
              },
            ],
          },
          hasPart: {
            "@type": "ItemList",
            itemListElement: PRODUCTS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/catalog/${p.id}`,
              name: p.name,
            })),
          },
        }),
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { q, category, vehicle, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
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
      sort: typeof sort;
    }>,
  ) =>
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch }),
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CatalogHeader />

      {/* Page header */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-end gap-4 px-6 py-12 md:py-16">
          <div className="min-w-0">
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / CATALOG — {filtered.length} UNITS
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-tight">
              FORGED FOR
              <br />
              <span className="text-turbo">BOOST</span>
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-relaxed text-muted-foreground md:block">
            Filter by vehicle platform and category. Every unit is bench-tested
            and shipped sealed.
          </p>
        </div>
      </section>

      {/* Search bar */}
      <section className="border-b border-border bg-graphite/40">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <ProductSearch
            value={q}
            onChange={(next) => update({ q: next })}
            placeholder="Search by name, code, vehicle, fitment, or spec…"
          />
        </div>
      </section>

      {/* Filter strip */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] tracking-widest lg:hidden"
          >
            <span>FILTERS</span>
            <span className="text-turbo">
              ({(category !== "ALL" ? 1 : 0) + (vehicle !== "ALL" ? 1 : 0)})
            </span>
          </button>

          <div className="hidden flex-1 items-center gap-8 lg:flex">
            <FilterRow
              label="CATEGORY"
              options={CATEGORIES}
              value={category}
              onChange={(v) => update({ category: v as Category })}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden font-mono text-[10px] tracking-widest text-muted-foreground sm:block">
              SORT
            </label>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as typeof sort })}
              className="border border-border bg-background px-3 py-2 font-mono text-[11px] tracking-widest text-foreground focus:border-turbo focus:outline-none"
            >
              <option value="FEATURED">FEATURED</option>
              <option value="PRICE_ASC">PRICE: LOW → HIGH</option>
              <option value="PRICE_DESC">PRICE: HIGH → LOW</option>
              <option value="BOOST">BOOST: HIGH → LOW</option>
            </select>
          </div>
        </div>

        {/* Vehicle strip (desktop) */}
        <div className="hidden border-t border-border lg:block">
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-3">
            <span className="mr-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              VEHICLE
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

        {/* Mobile drawer */}
        {mobileFiltersOpen && (
          <div className="border-t border-border bg-graphite px-6 py-5 lg:hidden">
            <div className="mb-5">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                CATEGORY
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
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                VEHICLE
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

      {/* Active filters */}
      {(q.trim() !== "" || category !== "ALL" || vehicle !== "ALL") && (
        <div className="border-b border-border">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 py-3">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              ACTIVE:
            </span>
            {q.trim() !== "" && (
              <Chip label={`"${q.trim()}"`} onClear={() => update({ q: "" })} />
            )}
            {category !== "ALL" && (
              <Chip
                label={category}
                onClear={() => update({ category: "ALL" })}
              />
            )}
            {vehicle !== "ALL" && (
              <Chip
                label={vehicle}
                onClear={() => update({ vehicle: "ALL" })}
              />
            )}
            <button
              onClick={() => update({ q: "", category: "ALL", vehicle: "ALL" })}
              className="ml-2 font-mono text-[10px] tracking-widest text-turbo hover:text-ember"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          {filtered.length === 0 ? (
            <div className="relative py-16 md:py-24 border border-dashed border-border/60 bg-gradient-to-b from-graphite/10 to-transparent">
              {/* Technical grid backdrop accent */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
                {/* Visual indicator (Stylized crosshairs/industrial compass) */}
                <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-border bg-background/50 backdrop-blur-sm">
                  <div className="absolute -left-1 -right-1 h-px bg-turbo/40" />
                  <div className="absolute -top-1 -bottom-1 w-px bg-turbo/40" />
                  <span className="font-mono text-xs tracking-widest text-turbo font-bold">
                    0.00%
                  </span>
                </div>

                <p className="font-mono text-[11px] tracking-[0.3em] text-turbo uppercase">
                  Search Diagnostics
                </p>
                <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl uppercase">
                  No Matching Profiles
                </h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Your search query{" "}
                  <span className="text-foreground font-mono bg-graphite px-1.5 py-0.5">
                    "{q || category + " + " + vehicle}"
                  </span>{" "}
                  did not return any calibrated turbo units in our active
                  database.
                </p>

                {/* Direct corrective actions */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() =>
                      update({ q: "", category: "ALL", vehicle: "ALL" })
                    }
                    className="border border-border bg-background px-6 py-3 font-heading text-[11px] tracking-[0.2em] text-foreground transition-all hover:border-turbo hover:text-turbo"
                  >
                    RESET SEARCH FILTER
                  </button>
                  <Link
                    to="/"
                    hash="contact"
                    className="border border-turbo bg-turbo px-6 py-3 font-heading text-[11px] tracking-[0.2em] text-white transition-all hover:bg-ember"
                  >
                    REQUEST CUSTOM SPEC
                  </Link>
                </div>

                {/* Popular Categories Shortcut Segment */}
                <div className="mt-16 border-t border-border pt-12">
                  <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    Browse Core Calibrations
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      {
                        name: "HYBRID",
                        label: "HYBRID",
                        desc: "Response & street",
                      },
                      {
                        name: "BILLET",
                        label: "BILLET PRO",
                        desc: "Billet wheel specs",
                      },
                      {
                        name: "COMPETITION",
                        label: "COMPETITION",
                        desc: "Extreme boost setups",
                      },
                      {
                        name: "OEM REPLACEMENT",
                        label: "OEM CLASS",
                        desc: "Direct replacement",
                      },
                    ].map((cat) => (
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
                          {cat.label}
                        </span>
                        <span className="mt-1 text-[10px] text-muted-foreground font-mono uppercase">
                          {cat.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mr-2">
                      Popular Platforms:
                    </span>
                    {["BMW", "AUDI", "PORSCHE", "MERCEDES"].map((v) => (
                      <button
                        key={v}
                        onClick={() =>
                          update({
                            q: "",
                            vehicle: v as Vehicle,
                            category: "ALL",
                          })
                        }
                        className="border border-border bg-background/40 hover:border-turbo px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors"
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

      {/* CTA */}
      <section className="border-b border-border bg-graphite">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-[1.4fr_auto]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              CUSTOM BUILDS
            </p>
            <h2 className="font-display text-4xl leading-[0.95] md:text-5xl">
              CAN'T FIND YOUR <span className="text-turbo">FITMENT?</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Send us your platform, target power and fuel — we'll spec the
              exact housing, wheel set and CHRA for your build.
            </p>
          </div>
          <Link
            to="/"
            hash="contact"
            className="inline-flex w-fit items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white hover:bg-ember"
          >
            REQUEST A QUOTE →
          </Link>
        </div>
      </section>

      <CatalogFooter />
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
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
            {o}
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
  const stockColor =
    product.stock === "IN STOCK"
      ? "text-foreground"
      : product.stock === "LOW STOCK"
        ? "text-ember"
        : "text-muted-foreground";
  return (
    <Link
      to="/catalog/$productId"
      params={{ productId: product.id }}
      className="group relative block bg-background transition-colors hover:bg-carbon"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
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
          {product.stock}
        </span>
        <span className="absolute bottom-4 right-4 translate-y-2 bg-turbo px-3 py-1.5 font-mono text-[10px] tracking-widest text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          VIEW DETAIL →
        </span>
      </div>

      <div className="border-t border-border p-5">
        <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground">
          <Highlighted
            text={`${product.code} · ${product.category}`}
            query={query}
          />
        </p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-display text-xl leading-tight tracking-wide">
            <Highlighted text={product.name} query={query} />
          </h3>
          <p className="shrink-0 font-display text-2xl text-turbo">
            {product.price.toLocaleString()}{" "}
            <span className="text-sm">GEL</span>
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-px bg-border">
          <Spec label="BOOST" value={`${product.boost} PSI`} />
          <Spec label="HP+" value={`${product.hp}`} />
          <Spec label="FITS" value={`${product.vehicles.length} PLATFORMS`} />
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

/* ---------- Shared header/footer (kept local to keep route self-contained) ---------- */
function CatalogHeader() {
  const [lang, setLang] = useState<"KA" | "EN">("KA");
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-wider">
            GMS
          </span>
          <span className="font-display text-2xl leading-none tracking-wider text-turbo">
            TURBO
          </span>
          <span className="hidden font-display text-2xl leading-none tracking-wider sm:inline">
            GEORGIA
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/catalog"
            className="font-heading text-xs tracking-[0.18em] text-turbo"
          >
            INVENTORY
          </Link>
          {["SERVICES", "GARAGE", "SHOWROOM"].map((item) => (
            <Link
              key={item}
              to="/"
              hash={item.toLowerCase()}
              className="font-heading text-xs tracking-[0.18em] text-foreground/80 hover:text-turbo"
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1 border border-border">
          {(["KA", "EN"] as const).map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 font-mono text-[11px] tracking-widest ${
                lang === code ? "bg-turbo text-white" : "text-muted-foreground"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function CatalogFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-6 py-8 font-mono text-[10px] tracking-widest text-muted-foreground md:flex-row md:items-center">
        <span>© 2026 GMS TURBO GEORGIA · INDUSTRIAL PRECISION</span>
        <Link to="/" className="hover:text-turbo">
          ← BACK TO HOME
        </Link>
      </div>
    </footer>
  );
}
