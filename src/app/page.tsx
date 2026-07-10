import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "GMS Turbo Georgia — Premium Turbocharger Engineering",
  description:
    "Premium turbocharger sales, diagnostics, repair and performance solutions. Hybrid, billet and OEM turbos engineered in Tbilisi, Georgia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "GMS Turbo Georgia — Give Your Engine A Second Life",
    description:
      "Premium turbocharger engineering. Hybrid, billet and competition-grade turbos.",
    url: "/",
    images: ["/og-image.jpg"],
  },
  twitter: {
    title: "GMS Turbo Georgia",
    description: "Premium turbocharger engineering in Tbilisi, Georgia.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GMS Turbo Georgia",
  url: "/",
  inLanguage: ["ka-GE", "en-US"],
};

export default function Index() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
