import type { Metadata } from "next";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Diagnostics, Rebuild, Hybrid Upgrades",
  description:
    "Full-service turbocharger diagnostics, OEM rebuilds, hybrid upgrades, VSR balancing and bench testing — performed in-house in Tbilisi.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — GMS Turbo Georgia",
    description:
      "Turbocharger diagnostics, rebuilds, hybrid upgrades and VSR balancing.",
    url: "/services",
    images: ["/og-image.jpg"],
  },
  twitter: {
    title: "GMS Turbo Services",
    description: "In-house turbocharger services in Tbilisi.",
  },
};

const SERVICE_NAMES_FOR_SEO = [
  "DIAGNOSTICS & FAULT SCAN",
  "OEM REBUILD",
  "HYBRID UPGRADE",
  "COMPETITION BUILD",
  "VSR BALANCING",
  "ACTUATOR & WASTEGATE",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Turbocharger repair, rebuild and performance engineering",
  provider: { "@type": "AutomotiveBusiness", name: "GMS Turbo Georgia" },
  areaServed: { "@type": "Country", name: "Georgia" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "GMS Turbo Services",
    itemListElement: SERVICE_NAMES_FOR_SEO.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesClient />
    </>
  );
}
