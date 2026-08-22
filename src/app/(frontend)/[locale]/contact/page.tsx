import type { Metadata } from "next";
import { getContact } from "@/lib/getContact";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ContactClient } from "./ContactClient";

// Read the contact page content from the Payload/Postgres DB on each
// request — same reasoning as / (src/app/(frontend)/page.tsx).
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "კონტაქტი - დარეკვა და ვიზიტი",
    description:
      "დაგვირეკეთ, მოგვწერეთ ან ეწვიეთ GMS Turbo Georgia-ს თბილისის ცენტრში. დაჯავშნეთ ზარი ჩვენს ტექნიკურ გუნდთან აღდგენის, ჰიბრიდული განახლების ან სპორტული აწყობის შესათანხმებლად.",
  },
  en: {
    title: "Contact - Book a Call & Visit",
    description:
      "Call, email or visit GMS Turbo Georgia in central Tbilisi. Book a callback with our technical team to spec a rebuild, hybrid upgrade or competition build.",
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
    alternates: localeAlternates(locale, "/contact"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/contact"),
      images: ["/og-image.jpg"],
    },
    twitter: { title: meta.title, description: meta.description },
  };
}

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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const contact = await getContact(locale);

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
