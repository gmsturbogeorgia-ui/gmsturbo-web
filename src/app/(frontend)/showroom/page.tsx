import type { Metadata } from "next";
import { getShowroom } from "@/lib/getShowroom";
import { getProducts } from "@/lib/getProducts";
import { ShowroomClient } from "./ShowroomClient";

// Read the showroom page content and highlighted products from the
// Payload/Postgres DB on each request — same reasoning as /
// (src/app/(frontend)/page.tsx).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Showroom — Tbilisi Flagship",
  description:
    "Visit the GMS Turbo Georgia flagship showroom in central Tbilisi. Hand-finished hybrid, billet and competition turbochargers on permanent display.",
  alternates: { canonical: "/showroom" },
  openGraph: {
    title: "Showroom — GMS Turbo Georgia",
    description: "Flagship turbocharger showroom in central Tbilisi.",
    url: "/showroom",
    images: ["/og-image.jpg"],
  },
  twitter: {
    title: "GMS Turbo Showroom",
    description: "Flagship showroom in central Tbilisi.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "GMS Turbo Georgia — Flagship Showroom",
  image: "/og-image.jpg",
  telephone: "+995 32 2 99 00 00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tsereteli Ave 114",
    addressLocality: "Tbilisi",
    postalCode: "0119",
    addressCountry: "GE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "11:00",
      closes: "18:00",
    },
  ],
};

export default async function ShowroomPage() {
  const [showroom, products] = await Promise.all([
    getShowroom(),
    getProducts(),
  ]);
  const highlights = products.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShowroomClient showroom={showroom} highlights={highlights} />
    </>
  );
}
