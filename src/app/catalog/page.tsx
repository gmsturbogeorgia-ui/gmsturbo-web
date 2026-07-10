import type { Metadata } from "next";
import { Suspense } from "react";
import { PRODUCTS } from "@/lib/products";
import { CatalogClient } from "./CatalogClient";

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

const jsonLd = {
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
      { "@type": "ListItem", position: 2, name: "Catalog", item: "/catalog" },
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
};

export default function CatalogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <CatalogClient />
      </Suspense>
    </>
  );
}
