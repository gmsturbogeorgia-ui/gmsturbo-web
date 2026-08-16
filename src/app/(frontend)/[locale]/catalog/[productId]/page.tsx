import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product } from "@/lib/products";
import { getProductById } from "@/lib/getProducts";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ProductDetailClient } from "./ProductDetailClient";

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

function jsonLdFor(p: Product) {
  const availability =
    p.stock === "IN STOCK"
      ? "https://schema.org/InStock"
      : p.stock === "LOW STOCK"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/MadeToOrder";

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    mpn: p.code,
    category: p.category,
    description: p.description,
    // gallery is optional in the CMS; an empty array here would emit
    // "image": [] which is invalid for schema.org/Product.
    image: p.gallery.length > 0 ? p.gallery : [p.img],
    brand: { "@type": "Brand", name: "GMS Turbo Georgia" },
    manufacturer: { "@type": "Organization", name: "GMS Turbo Georgia" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Max Boost", value: p.boost, unitText: "PSI" },
      { "@type": "PropertyValue", name: "Crank HP Potential", value: p.hp, unitText: "HP" },
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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Catalog", item: "/catalog" },
      { "@type": "ListItem", position: 3, name: p.name, item: `/catalog/${p.id}` },
    ],
  };

  return [product, breadcrumb];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { productId, locale } = await params;
  const product = await getProductById(productId, locale);
  if (!product) notFound();

  return (
    <>
      {jsonLdFor(product).map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <ProductDetailClient product={product} />
    </>
  );
}
