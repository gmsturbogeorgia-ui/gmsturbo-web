import type { Metadata } from "next";
import { getShowroom } from "@/lib/getShowroom";
import { getProducts } from "@/lib/getProducts";
import { localeAlternates, OG_IMAGE } from "@/lib/i18n/metadata";
import { localeHref, type Locale } from "@/lib/i18n/locales";
import { ShowroomClient } from "./ShowroomClient";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbNode,
  collectionNode,
  crumbLabels,
  graph,
} from "@/lib/structured-data";

// Read the showroom page content and highlighted products from the
// Payload/Postgres DB on each request — same reasoning as /
// (src/app/(frontend)/page.tsx).
export const dynamic = "force-dynamic";

const META: Record<Locale, { title: string; description: string }> = {
  ka: {
    title: "სავიტრინო დარბაზი - თბილისი",
    description:
      "GMS Turbo-ს სავიტრინო დარბაზი და საწყობი თბილისში — ტურბინები, კარტრიჯები, აქტუატორები და კოლექტორები ადგილზე. მობრძანდით, ნახეთ ნაწილები საკუთარი თვალით და მიიღეთ პროფესიონალური კონსულტაცია.",
  },
  en: {
    title: "Showroom - Tbilisi Flagship",
    description:
      "The GMS Turbo showroom and warehouse in Tbilisi — turbochargers, cartridges, actuators and manifolds in stock. Come see the parts in person and get expert advice.",
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
    alternates: localeAlternates(locale, "/showroom"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeHref(locale, "/showroom"),
      images: [OG_IMAGE],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function ShowroomPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [showroom, products] = await Promise.all([
    getShowroom(locale),
    getProducts(locale),
  ]);
  const highlights = products.slice(0, 4);

  const crumbs = crumbLabels(locale);
  const trail = [
    { name: crumbs.home, path: "/" },
    { name: META[locale].title, path: "/showroom" },
  ];

  return (
    <>
      {/* Same as /contact: the third copy of the business is gone, replaced
          by a page node that refers to it — plus the units this page puts on
          the floor. */}
      <JsonLd
        data={graph(
          breadcrumbNode(locale, trail),
          collectionNode(locale, {
            path: "/showroom",
            name: META[locale].title,
            description: META[locale].description,
            products: highlights,
            trail,
          }),
        )}
      />
      <ShowroomClient showroom={showroom} highlights={highlights} />
    </>
  );
}
