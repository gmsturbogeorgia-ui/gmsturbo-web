import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "./i18n/locales";
import { mediaUrl, type MediaRef } from "./mediaUrl";

// Server-only data access for the `showroom` Payload global — same shape as
// src/lib/getHome.ts, which see for why this is no longer a field-by-field
// mapping of `{ en, ka }` pairs.
export type ShowroomContent = {
  hero: { tag: string; title1: string; title2: string; image: string };
  stats: { value: string; label: string }[];
  space: {
    kicker: string;
    title1: string;
    title2: string;
    p1: string;
    p2: string;
    bookViewingLabel: string;
  };
  gallery: {
    kicker: string;
    title: string;
    lead: string;
    bannerImage: string;
    bannerCaption: string;
    items: { image: string; caption: string }[];
  };
  display: { kicker: string; title: string; fullCatalogLabel: string };
  visit: {
    kicker: string;
    title1: string;
    title2: string;
    blurb: string;
    addressLabel: string;
    address: string;
    callLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
  };
};

type ShowroomDoc = Omit<ShowroomContent, "hero" | "gallery"> & {
  hero: Omit<ShowroomContent["hero"], "image"> & { image: MediaRef };
  gallery: Omit<ShowroomContent["gallery"], "bannerImage" | "items"> & {
    bannerImage: MediaRef;
    items: { image: MediaRef; caption: string }[];
  };
};

export async function getShowroom(locale: Locale): Promise<ShowroomContent> {
  const payload = await getPayload({ config });
  const doc = (await payload.findGlobal({
    slug: "showroom",
    locale,
    // depth 1 populates the `media` docs behind the hero/banner/mosaic
    // upload fields.
    depth: 1,
  })) as unknown as ShowroomDoc;

  return {
    ...doc,
    hero: { ...doc.hero, image: mediaUrl(doc.hero.image) },
    gallery: {
      ...doc.gallery,
      bannerImage: mediaUrl(doc.gallery.bannerImage),
      // A mosaic row whose upload was cleared in /admin would render an
      // `<img>` with no src, so drop it rather than leave a broken tile.
      items: doc.gallery.items
        .map((i) => ({ image: mediaUrl(i.image), caption: i.caption }))
        .filter((i) => i.image !== ""),
    },
  };
}
