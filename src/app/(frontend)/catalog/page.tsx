import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/getProducts";
import { getCatalog } from "@/lib/getCatalog";
import { CatalogClient } from "./CatalogClient";

// Read the catalog from the Payload/Postgres DB on each request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Turbocharger Catalog",
  description:
    "Browse premium turbochargers by vehicle compatibility, category and performance specs. Hybrid, billet, OEM and competition turbos in stock in Tbilisi.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Turbocharger Catalog — GMS Turbo Georgia",
    description:
      "Hybrid, billet, OEM and competition-grade turbochargers in stock in Tbilisi.",
    url: "/catalog",
    images: ["/og-catalog.jpg"],
  },
  twitter: {
    title: "Turbocharger Catalog — GMS Turbo Georgia",
    description: "Premium turbochargers filtered by vehicle and category.",
    images: ["/og-catalog.jpg"],
  },
};

export default async function CatalogPage() {
  const [products, catalog] = await Promise.all([getProducts(), getCatalog()]);

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
