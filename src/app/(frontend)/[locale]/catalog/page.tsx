import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/getProducts";
import { getCatalog } from "@/lib/getCatalog";
import { localeAlternates, OG_IMAGE } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { CatalogClient } from "./CatalogClient";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbNode,
  collectionNode,
  crumbLabels,
  graph,
} from "@/lib/structured-data";

// Read the catalog from the Payload/Postgres DB on each request.
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "ტურბოკომპრესორების კატალოგი",
    description:
      "ტურბინების და ტურბოს ნაწილების (კარტრიჯი, აქტუატორი, კოლექტორი და ა.შ) ყველაზე დიდი საწყობი საქართველოში.",
  },
  en: {
    title: "Turbocharger Catalog",
    description:
      "The largest stock of turbochargers and turbo parts (cartridges, actuators, manifolds and more) in Georgia.",
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
      images: [OG_IMAGE],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
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

  const crumbs = crumbLabels(locale);
  const trail = [
    { name: crumbs.home, path: "/" },
    { name: crumbs.catalog, path: "/catalog" },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          collectionNode(locale, {
            path: "/catalog",
            name: META[locale].title,
            description: META[locale].description,
            products,
            trail,
          }),
        )}
      />
      <Suspense fallback={null}>
        <CatalogClient products={products} catalog={catalog} />
      </Suspense>
    </>
  );
}
