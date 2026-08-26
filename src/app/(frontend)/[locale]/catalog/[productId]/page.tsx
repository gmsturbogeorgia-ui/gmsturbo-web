import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/getProducts";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ProductDetailClient } from "./ProductDetailClient";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbNode,
  crumbLabels,
  graph,
  productNode,
} from "@/lib/structured-data";

// Read each product from the Payload/Postgres DB on each request.
export const dynamic = "force-dynamic";

type Params = { productId: string; locale: Locale };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { productId, locale } = await params;
  const p = await getProductById(productId, locale);
  if (!p) return { title: "Product not found" };

  return {
    title: p.name,
    description: p.tagline,
    alternates: localeAlternates(locale, `/catalog/${p.id}`),
    openGraph: {
      title: p.name,
      description: p.tagline,
      url: localeHref(locale, `/catalog/${p.id}`),
      images: [p.img],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description: p.tagline,
      images: [p.img],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { productId, locale } = await params;
  const product = await getProductById(productId, locale);
  if (!product) notFound();

  /* "You might also like" used to be filtered out of a hardcoded array in
     src/lib/products.ts, so it happily offered units that no longer existed
     in the CMS. It reads the real catalog now — same category, current unit
     excluded, first four. */
  const related = (await getProducts(locale))
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const crumbs = crumbLabels(locale);
  const trail = [
    { name: crumbs.home, path: "/" },
    { name: crumbs.catalog, path: "/catalog" },
    { name: product.name, path: `/catalog/${product.id}` },
  ];

  return (
    <>
      {/* One graph, not two loose blobs: inside it the product's `seller` and
          `manufacturer` resolve to the business node the layout declares,
          instead of naming the same shop a third time. */}
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          productNode(locale, product),
        )}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
