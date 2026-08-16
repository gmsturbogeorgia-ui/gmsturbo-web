import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/getProducts";
import { getCatalog } from "@/lib/getCatalog";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { CatalogClient } from "./CatalogClient";

// Read the catalog from the Payload/Postgres DB on each request.
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "ტურბოკომპრესორების კატალოგი",
    description:
      "დაათვალიერეთ ტურბოკომპრესორები ავტომობილის თავსებადობით, კატეგორიითა და მახასიათებლებით. ჰიბრიდული, ბილეტ, OEM და სპორტული ტურბოები მარაგშია თბილისში.",
  },
  en: {
    title: "Turbocharger Catalog",
    description:
      "Browse premium turbochargers by vehicle compatibility, category and performance specs. Hybrid, billet, OEM and competition turbos in stock in Tbilisi.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale];

  return {
    title: meta.title,
    description: meta.description,
    alternates: localeAlternates(locale, "/catalog"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/catalog"),
      images: ["/og-catalog.jpg"],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: ["/og-catalog.jpg"],
    },
  };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [products, catalog] = await Promise.all([
    getProducts(locale),
    getCatalog(locale),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Turbocharger Catalog",
    url: "/catalog",
    about: "Premium turbochargers — hybrid, billet, OEM, competition.",
    numberOfItems: products.length,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "Catalog", item: "/catalog" },
      ],
    },
    hasPart: {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/catalog/${p.id}`,
        name: p.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <CatalogClient products={products} catalog={catalog} />
      </Suspense>
    </>
  );
}
