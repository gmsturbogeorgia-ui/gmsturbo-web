"use client";

import { LocaleLink as Link } from "@/components/LocaleLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  HomeIcon,
} from "@/components/Breadcrumb";
import type { Product } from "@/lib/products";
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

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <ProductCrumbs product={product} />
        <ProductShowcase product={product} />
        <Specs product={product} />
        <Compatibility product={product} />
        <TireTrack className="mx-6 my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />
        <ProductQuoteForm product={product} />
        <RelatedProducts related={related} />
      </main>
      <SiteFooter />
    </>
  );
}

/* The trail matches the BreadcrumbList the page ships in its JSON-LD — a
   visible trail is what Google asks for beside the markup, and the two
   disagreeing is worse than neither. */
function ProductCrumbs({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <Breadcrumb className="shell pt-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <HomeIcon className="size-4" />
            <span className="sr-only">{t("product.home")}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/catalog">
            {t("product.catalog")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{product.code}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
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

function RelatedProducts({ related }: { related: Product[] }) {
  const { t } = useLanguage();
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
