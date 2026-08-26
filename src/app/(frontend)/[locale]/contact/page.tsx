import type { Metadata } from "next";
import { getContact } from "@/lib/getContact";
import { localeAlternates } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ContactClient } from "./ContactClient";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbNode,
  pageNode,
  crumbLabels,
  graph,
} from "@/lib/structured-data";

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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const contact = await getContact(locale);

  const crumbs = crumbLabels(locale);
  const trail = [
    { name: crumbs.home, path: "/" },
    { name: META[locale].title, path: "/contact" },
  ];

  return (
    <>
      {/* The AutomotiveBusiness this page used to declare was a second,
          anonymous copy of the one the layout already emits — same shop,
          different node, no `@id` tying them together. What is left is the
          page, pointing at the single business by id. */}
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          pageNode(locale, {
            type: "ContactPage",
            path: "/contact",
            name: META[locale].title,
            description: META[locale].description,
            trail,
          }),
        )}
      />
      <ContactClient contact={contact} />
    </>
  );
}
