"use client";

import Link from "next/link";
import { PRODUCTS, type Product } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";
import { specLabel } from "@/lib/i18n/dictionary";
import { ProductShowcase } from "./ProductShowcase";
import { ProductQuoteForm } from "./ProductQuoteForm";

export function ProductDetailClient({ product }: { product: Product }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Breadcrumb product={product} />
      <ProductShowcase product={product} />
      <Specs product={product} />
      <Compatibility product={product} />
      <ProductQuoteForm product={product} />
      <RelatedProducts current={product} />
      <SiteFooter />
    </div>
  );
}

function Breadcrumb({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-4 font-mono text-[10px] tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-turbo">
          {t("product.home")}
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-turbo">
          {t("product.catalog")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.code}</span>
      </div>
    </div>
  );
}

function Specs({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  return (
    <section className="border-b border-border bg-graphite">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("product.specsKicker")}
            </p>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              {t("product.specsTitle")}
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground md:inline">
            {product.specs.length} {t("product.parameters")}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          {product.specs.map((s) => (
            <div
              key={s.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-baseline gap-4 bg-graphite px-6 py-5"
            >
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {specLabel(s.label, lang).toUpperCase()}
              </dt>
              <dd className="font-display text-lg tracking-wide">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Compatibility({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("product.compatKicker")}
          </p>
          <h2 className="font-display text-4xl tracking-wide md:text-5xl">
            {t("product.compatTitle")}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            {t("product.compatBlurb")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {product.fitments.map((f, i) => (
            <article
              key={`${f.make}-${i}`}
              className="bg-background p-6 transition-colors hover:bg-carbon"
            >
              <p className="font-mono text-[10px] tracking-widest text-turbo">
                {t("product.fitmentTag")} 0{i + 1}
              </p>
              <p className="mt-3 font-display text-2xl tracking-wide">{f.make}</p>
              <p className="mt-1 text-sm text-foreground/90">{f.model}</p>
              <div className="mt-5 grid grid-cols-2 gap-px bg-border">
                <div className="bg-background pr-3 pt-3">
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    {t("product.years")}
                  </p>
                  <p className="mt-1 font-display text-base">{f.years}</p>
                </div>
                <div className="bg-background pl-3 pt-3">
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    {t("product.engine")}
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

function RelatedProducts({ current }: { current: Product }) {
  const { t } = useLanguage();
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
              {t("product.relatedKicker")}
            </p>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">
              {t("product.relatedTitle")}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline"
          >
            {t("catalog.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/catalog/${p.id}`}
              className="group block bg-background transition-colors hover:bg-carbon"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  <h3 className="font-display text-lg tracking-wide">{p.name}</h3>
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
