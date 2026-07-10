import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProductById, PRODUCTS, type Product } from "@/lib/products";

export const Route = createFileRoute("/catalog/$productId")({
  loader: ({ params }) => {
    const product = getProductById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) {
      return { meta: [{ title: "Product not found — GMS Turbo Georgia" }] };
    }
    const availability =
      p.stock === "IN STOCK"
        ? "https://schema.org/InStock"
        : p.stock === "LOW STOCK"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/MadeToOrder";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      sku: p.code,
      mpn: p.code,
      category: p.category,
      description: p.description,
      image: p.gallery,
      brand: { "@type": "Brand", name: "GMS Turbo Georgia" },
      manufacturer: { "@type": "Organization", name: "GMS Turbo Georgia" },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Max Boost",
          value: p.boost,
          unitText: "PSI",
        },
        {
          "@type": "PropertyValue",
          name: "Crank HP Potential",
          value: p.hp,
          unitText: "HP",
        },
        ...p.specs.map((s) => ({
          "@type": "PropertyValue",
          name: s.label,
          value: s.value,
        })),
      ],
      isAccessoryOrSparePartFor: p.fitments.map((f) => ({
        "@type": "Vehicle",
        brand: { "@type": "Brand", name: f.make },
        model: f.model,
        vehicleModelDate: f.years,
        vehicleEngine: { "@type": "EngineSpecification", name: f.engine },
      })),
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "GEL",
        availability,
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "GMS Turbo Georgia" },
      },
    };
    const url = `/catalog/${p.id}`;
    return {
      meta: [
        { title: `${p.name} — GMS Turbo Georgia` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.name} — GMS Turbo Georgia` },
        { property: "og:description", content: p.tagline },
        { property: "og:image", content: p.img },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:image", content: p.img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${p.name} — GMS Turbo Georgia` },
        { name: "twitter:description", content: p.tagline },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Catalog",
                item: "/catalog",
              },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          }),
        },
      ],
    };
  },

  notFoundComponent: ProductNotFound,
  errorComponent: ProductError,
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DetailHeader />
      <Breadcrumb product={product} />
      <Showcase product={product} />
      <Specs product={product} />
      <Compatibility product={product} />
      <QuoteCTA product={product} />
      <RelatedProducts current={product} />
      <DetailFooter />
    </div>
  );
}

/* ---------------- BREADCRUMB ---------------- */
function Breadcrumb({ product }: { product: Product }) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-4 font-mono text-[10px] tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-turbo">
          HOME
        </Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-turbo">
          CATALOG
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.code}</span>
      </div>
    </div>
  );
}

/* ---------------- SHOWCASE / GALLERY ---------------- */
function Showcase({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const stockColor =
    product.stock === "IN STOCK"
      ? "text-foreground"
      : product.stock === "LOW STOCK"
        ? "text-ember"
        : "text-muted-foreground";

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-border lg:grid-cols-[1.15fr_1fr]">
        {/* Gallery */}
        <div className="bg-background">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite lg:aspect-auto lg:h-full lg:min-h-[640px]">
            <img
              src={product.gallery[active]}
              alt={product.name}
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-5 top-5 bg-turbo px-3 py-1.5 font-mono text-[10px] tracking-widest text-white">
              {product.code}
            </span>
            <span
              className={`absolute right-5 top-5 border border-border bg-background/80 px-3 py-1.5 font-mono text-[10px] tracking-widest backdrop-blur ${stockColor}`}
            >
              {product.stock}
            </span>
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4 gap-px border-t border-border bg-border">
              {product.gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden bg-background ${
                    active === i ? "ring-2 ring-inset ring-turbo" : ""
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between bg-background p-8 lg:p-12">
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / {product.category}
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-foreground/90">
              {product.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-px bg-border">
              <HeadlineStat
                label="MAX BOOST"
                value={`${product.boost}`}
                unit="PSI"
              />
              <HeadlineStat
                label="HP POTENTIAL"
                value={`${product.hp}`}
                unit="HP"
              />
              <HeadlineStat
                label="WARRANTY"
                value={
                  product.specs
                    .find((s) => s.label === "Warranty")
                    ?.value.split(" ")[0] ?? "12"
                }
                unit="MO"
              />
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  PRICE FROM
                </p>
                <p className="mt-1 font-display text-5xl text-turbo">
                  {product.price.toLocaleString()}
                  <span className="ml-2 text-xl text-foreground">GEL</span>
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <a
                href="#quote"
                className="inline-flex items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white hover:bg-ember"
              >
                REQUEST A QUOTE →
              </a>
              <a
                href="tel:+995322990000"
                className="inline-flex items-center justify-center border border-border px-7 py-4 font-heading text-sm tracking-[0.2em] hover:border-turbo hover:text-turbo"
              >
                CALL WORKSHOP
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeadlineStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-background p-4">
      <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl leading-none">
        {value}
        <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

/* ---------------- SPECS ---------------- */
function Specs({ product }: { product: Product }) {
  return (
    <section className="border-b border-border bg-graphite">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 01 — TECHNICAL DATA
            </p>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              SPECIFICATIONS
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground md:inline">
            {product.specs.length} PARAMETERS
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          {product.specs.map((s) => (
            <div
              key={s.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-baseline gap-4 bg-graphite px-6 py-5"
            >
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {s.label.toUpperCase()}
              </dt>
              <dd className="font-display text-lg tracking-wide">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------- COMPATIBILITY ---------------- */
function Compatibility({ product }: { product: Product }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            / 02 — VEHICLE COMPATIBILITY
          </p>
          <h2 className="font-display text-4xl tracking-wide md:text-5xl">
            CONFIRMED FITMENTS
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Verified against OEM service data. Contact our team for unlisted
            platforms — most engines can be adapted with the correct manifold
            and downpipe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {product.fitments.map((f, i) => (
            <article
              key={`${f.make}-${i}`}
              className="bg-background p-6 transition-colors hover:bg-carbon"
            >
              <p className="font-mono text-[10px] tracking-widest text-turbo">
                FITMENT 0{i + 1}
              </p>
              <p className="mt-3 font-display text-2xl tracking-wide">
                {f.make}
              </p>
              <p className="mt-1 text-sm text-foreground/90">{f.model}</p>
              <div className="mt-5 grid grid-cols-2 gap-px bg-border">
                <div className="bg-background pr-3 pt-3">
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    YEARS
                  </p>
                  <p className="mt-1 font-display text-base">{f.years}</p>
                </div>
                <div className="bg-background pl-3 pt-3">
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    ENGINE
                  </p>
                  <p className="mt-1 font-display text-base">{f.engine}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {product.vehicles.map((v) => (
            <span
              key={v}
              className="border border-border px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- QUOTE ---------------- */
function QuoteCTA({ product }: { product: Product }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="quote" className="border-b border-border bg-graphite">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            / 03 — REQUEST A QUOTE
          </p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-6xl">
            SPEC YOUR
            <br />
            <span className="text-turbo">BUILD</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tell us your vehicle, target power and fuel. Our technical team will
            confirm fitment, lead time, and the final price tailored to your
            build — usually within one business day.
          </p>

          <div className="mt-10 space-y-5 border-t border-border pt-6">
            <Row label="UNIT" value={`${product.name} · ${product.code}`} />
            <Row
              label="LIST PRICE"
              value={`${product.price.toLocaleString()} GEL`}
            />
            <Row label="STOCK" value={product.stock} />
            <Row
              label="LEAD TIME"
              value={
                product.stock === "MADE TO ORDER" ? "3–4 WEEKS" : "2–5 DAYS"
              }
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2"
        >
          <Field label="FULL NAME" name="name" required />
          <Field label="PHONE" name="phone" type="tel" required />
          <Field
            label="EMAIL"
            name="email"
            type="email"
            required
            className="sm:col-span-2"
          />
          <Field
            label="VEHICLE (MAKE / MODEL / YEAR)"
            name="vehicle"
            required
            className="sm:col-span-2"
          />
          <Field label="TARGET POWER (HP)" name="hp" type="number" />
          <Field label="FUEL" name="fuel" placeholder="98 / E85 / Diesel" />
          <div className="bg-background p-5 sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest text-muted-foreground">
              NOTES
            </label>
            <textarea
              name="notes"
              rows={4}
              className="mt-2 w-full resize-none border-0 bg-transparent font-sans text-sm text-foreground focus:outline-none"
              placeholder="Supporting mods, timeline, anything we should know…"
            />
          </div>
          <div className="bg-background p-5 sm:col-span-2">
            <button
              type="submit"
              disabled={sent}
              className="w-full bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember disabled:bg-steel disabled:text-muted-foreground"
            >
              {sent ? "REQUEST SENT — WE'LL BE IN TOUCH" : "SEND REQUEST →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-lg tracking-wide">{value}</span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-background p-5 ${className}`}>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="ml-1 text-turbo">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border-0 bg-transparent font-sans text-base text-foreground focus:outline-none"
      />
    </div>
  );
}

/* ---------------- RELATED ---------------- */
function RelatedProducts({ current }: { current: Product }) {
  const related = PRODUCTS.filter(
    (p) => p.id !== current.id && p.category === current.category,
  ).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / RELATED — SAME CATEGORY
            </p>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              YOU MAY ALSO CONSIDER
            </h2>
          </div>
          <Link
            to="/catalog"
            className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline"
          >
            VIEW ALL →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.id}
              to="/catalog/$productId"
              params={{ productId: p.id }}
              className="group block bg-background transition-colors hover:bg-carbon"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-border p-5">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {p.code}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <h3 className="font-display text-lg tracking-wide">
                    {p.name}
                  </h3>
                  <p className="shrink-0 font-display text-xl text-turbo">
                    {p.price.toLocaleString()} GEL
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ERROR / NOT FOUND ---------------- */
function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DetailHeader />
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-6 py-24">
        <p className="font-mono text-[11px] tracking-[0.25em] text-turbo">
          / 404
        </p>
        <h1 className="font-display text-6xl tracking-tight">
          PRODUCT NOT FOUND
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The unit you're looking for isn't in our catalog. It may have been
          retired or renamed.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white hover:bg-ember"
        >
          ← BACK TO CATALOG
        </Link>
      </div>
    </div>
  );
}

function ProductError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background p-12 text-foreground">
      <h1 className="font-display text-4xl">SOMETHING BROKE</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 border border-turbo px-6 py-3 font-heading text-xs tracking-[0.2em] text-turbo"
      >
        RETRY
      </button>
    </div>
  );
}

/* ---------------- HEADER / FOOTER ---------------- */
function DetailHeader() {
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
      </div>
    </header>
  );
}

function DetailFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-6 py-8 font-mono text-[10px] tracking-widest text-muted-foreground md:flex-row md:items-center">
        <span>© 2026 GMS TURBO GEORGIA · INDUSTRIAL PRECISION</span>
        <Link to="/catalog" className="hover:text-turbo">
          ← BACK TO CATALOG
        </Link>
      </div>
    </footer>
  );
}
