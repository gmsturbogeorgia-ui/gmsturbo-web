import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";
import { mediaUrl, type MediaRef } from "./mediaUrl";

// Server-only data access for the `home` Payload global.
//
// The locale is a URL segment now, so this asks Payload for one language and
// gets plain strings back. It used to query `locale: "all"` and hand the
// browser both languages as `kicker`/`kickerKa` pairs for the client to pick
// between — which is what made this file, and the three getters beside it,
// several hundred lines of mechanical field-by-field mapping. All that is
// gone: the doc already has the shape the page renders, and only the image
// relationships still need flattening.
export type HomeContent = {
  hero: {
    kicker: string;
    line1: string;
    line2: string;
    line3a: string;
    line3b: string;
    blurb: string;
    ctaLabel: string;
  };
  stats: { value: string; label: string }[];
  inventory: { title: string; lead: string; viewAllLabel: string };
  journey: {
    kicker: string;
    title: string;
    lead: string;
    steps: { n: string; title: string; desc: string }[];
  };
  workshop: {
    tag: string;
    title: string;
    blurb: string;
    scheduleVisitLabel: string;
    image: string;
  };
  booking: {
    kicker: string;
    title1: string;
    title2: string;
    blurb: string;
  };
};

// Identical to HomeContent except the workshop image, which arrives as a
// populated `media` doc (depth 1) rather than a URL.
type HomeDoc = Omit<HomeContent, "workshop"> & {
  workshop: Omit<HomeContent["workshop"], "image"> & { image: MediaRef };
};

export async function getHome(locale: Locale): Promise<HomeContent> {
  const payload = await getPayload({ config });
  const doc = (await payload.findGlobal({
    slug: "home",
    locale,
    // depth 1 populates the `media` doc behind the workshop upload field,
    // which is where its image URL comes from.
    depth: 1,
  })) as unknown as HomeDoc;

  return {
    ...doc,
    workshop: { ...doc.workshop, image: mediaUrl(doc.workshop.image) },
  };
}
