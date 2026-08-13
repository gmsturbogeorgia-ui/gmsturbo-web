import type { Metadata } from "next";
import { getContact } from "@/lib/getContact";
import { ContactClient } from "./ContactClient";

// Read the contact page content from the Payload/Postgres DB on each
// request — same reasoning as / (src/app/(frontend)/page.tsx).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Book a Call & Visit",
  description:
    "Call, email or visit GMS Turbo Georgia in central Tbilisi. Book a callback with our technical team to spec a rebuild, hybrid upgrade or competition build.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — GMS Turbo Georgia",
    description:
      "Call, email or visit our Tbilisi workshop, or book a callback with our engineers.",
    url: "/contact",
    images: ["/og-image.jpg"],
  },
  twitter: {
    title: "Contact GMS Turbo Georgia",
    description: "Book a callback or visit our Tbilisi workshop.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "GMS Turbo Georgia",
  image: "/og-image.jpg",
  telephone: "+995 32 2 99 00 00",
  email: "showroom@gmsturbo.ge",
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

export default async function ContactPage() {
  const contact = await getContact();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient contact={contact} />
    </>
  );
}
