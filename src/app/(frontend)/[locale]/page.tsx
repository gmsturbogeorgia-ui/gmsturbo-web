import type { Metadata } from "next";
import { getHome } from "@/lib/getHome";
import { getProducts } from "@/lib/getProducts";
import { localeAlternates, OG_IMAGE } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { HomeClient } from "./HomeClient";

// Read the home page content and featured products from the Payload/Postgres
// DB on each request — same reasoning as /catalog (src/app/catalog/page.tsx).
export const dynamic = "force-dynamic";

// The Georgian copy here is the client's own wording, used verbatim. It runs
// past the ~160 characters Google shows in a snippet, but the keyword-bearing
// first sentence lands well inside that, and the full text is what social
// cards (og:description) render — so nothing meaningful is lost to the cut.
const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "GMS Turbo Georgia - ტურბოკომპრესორების ინჟინერია",
    description:
      "GMS Turbo გთავაზობთ უმაღლესი ხარისხის ტურბინებისა და ტურბოსისტემების ნაწილებს, რომლებიც განკუთვნილია სხვადასხვა ტიპის ავტომობილებისთვის. ჩვენ გვყავს გამოცდილი გუნდი, რომელიც დაგეხმარებათ ყველა საჭირო კომპონენტის შერჩევასა და ინსტალაციაში.",
  },
  en: {
    title: "GMS Turbo Georgia - Premium Turbocharger Engineering",
    description:
      "GMS Turbo supplies premium turbochargers and turbo system parts for every type of vehicle. Our experienced team helps you pick and fit every component you need.",
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
    alternates: localeAlternates(locale, "/"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/"),
      images: [OG_IMAGE],
    },
    twitter: {
      title: "GMS Turbo Georgia",
      description: meta.description,
      images: [OG_IMAGE],
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GMS Turbo Georgia",
  url: "/",
  inLanguage: ["ka-GE", "en-US"],
};

export default async function Index({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [home, products] = await Promise.all([
    getHome(locale),
    getProducts(locale),
  ]);
  const featured = products.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient home={home} featured={featured} />
    </>
  );
}
