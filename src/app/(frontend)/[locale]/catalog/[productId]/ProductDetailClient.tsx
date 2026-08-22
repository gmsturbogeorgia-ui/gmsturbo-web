"use client";

import { LocaleLink as Link } from "@/components/LocaleLink";
import { PRODUCTS, type Product } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductCard, ProductGrid } from "@/components/ProductCard";
import {
  SectionHead,
  Tag,
  TextLink,
  TireTrack,
} from "@/components/Primitives";
import { useLanguage } from "@/lib/i18n/context";
import { specLabel } from "@/lib/i18n/dictionary";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";
import { ProductShowcase } from "./ProductShowcase";
import { ProductQuoteForm } from "./ProductQuoteForm";

export function ProductDetailClient({ product }: { product: Product }) {
  return (
    <>
      <SiteHeader />
      <main>
        <Breadcrumb product={product} />
        <ProductShowcase product={product} />
        <Specs product={product} />
        <Compatibility product={product} />
        <TireTrack className="mx-6 my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />
        <ProductQuoteForm product={product} />
        <RelatedProducts current={product} />
      </main>
      <SiteFooter />
    </>
  );
}

function Breadcrumb({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <nav aria-label="Breadcrumb" className="shell pt-5">
      <ol className="flex items-center gap-2 text-sm text-ink-mute">
        <li>
          <Link href="/" className="transition-colors hover:text-ink">
            {t("product.home")}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/catalog" className="transition-colors hover:text-ink">
            {t("product.catalog")}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-ink-soft">{product.code}</li>
      </ol>
    </nav>
  );
}

/* Specs as a definition list on a graphite band. Two columns of rows with
   the value right-aligned — readable as a table without drawing one.

   Specs are optional in the CMS: a product with no rows renders no section
   at all, rather than a graphite band with a heading reading "0 parameters"
   over empty space. */
function Specs({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  if (product.specs.length === 0) return null;
  return (
    <section className="bg-graphite">
      <div className="shell py-16 md:py-20">
        <SectionHead
          eyebrow={t("product.specsKicker")}
          title={t("product.specsTitle")}
          lead={`${product.specs.length} ${t("product.parameters")}`}
        />

        <dl className="mt-10 grid gap-x-16 sm:grid-cols-2">
          {product.specs.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-6 py-4"
            >
              <dt className="text-[0.9375rem] text-ink-mute">
                {specLabel(s.label, lang)}
              </dt>
              <dd className="tnum text-right text-[0.9375rem] font-semibold text-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Compatibility({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { vehLabel } = useTaxonomy();
  return (
    <section className="shell py-16 md:py-20">
      <SectionHead
        eyebrow={t("product.compatKicker")}
        title={t("product.compatTitle")}
        lead={t("product.compatBlurb")}
      />

      <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {product.fitments.map((f, i) => (
          <article key={`${f.make}-${i}`}>
            <h3 className="font-display text-xl font-semibold">{f.make}</h3>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">{f.model}</p>
            <p className="tnum mt-3 text-sm text-ink-mute">
              {f.years} · {f.engine}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        {product.vehicles.map((v) => (
          <Tag key={v}>{vehLabel(v)}</Tag>
        ))}
      </div>
    </section>
  );
}

function RelatedProducts({ current }: { current: Product }) {
  const { t } = useLanguage();
  const related = PRODUCTS.filter(
    (p) => p.id !== current.id && p.category === current.category,
  ).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="shell py-16 md:py-20">
      <SectionHead
        eyebrow={t("product.relatedKicker")}
        title={t("product.relatedTitle")}
        action={<TextLink href="/catalog">{t("catalog.viewAll")}</TextLink>}
      />
      <ProductGrid className="mt-10">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductGrid>
    </section>
  );
}
