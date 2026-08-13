import { getPayload } from "payload";
import config from "@payload-config";

// Server-only data access for the `showroom` Payload global. Maps the DB
// doc onto the shape ShowroomClient renders — mirrors src/lib/getHome.ts.
export type ShowroomContent = {
  hero: { tag: string; tagKa: string; title1: string; title1Ka: string; title2: string; title2Ka: string; image: string };
  stats: { value: string; valueKa: string; label: string; labelKa: string }[];
  space: {
    kicker: string;
    kickerKa: string;
    title1: string;
    title1Ka: string;
    title2: string;
    title2Ka: string;
    p1: string;
    p1Ka: string;
    p2: string;
    p2Ka: string;
    bookViewingLabel: string;
    bookViewingLabelKa: string;
  };
  gallery: {
    kicker: string;
    kickerKa: string;
    title: string;
    titleKa: string;
    lead: string;
    leadKa: string;
    bannerImage: string;
    bannerCaption: string;
    bannerCaptionKa: string;
    items: { image: string; caption: string; captionKa: string }[];
  };
  display: {
    kicker: string;
    kickerKa: string;
    title: string;
    titleKa: string;
    fullCatalogLabel: string;
    fullCatalogLabelKa: string;
  };
  visit: {
    kicker: string;
    kickerKa: string;
    title1: string;
    title1Ka: string;
    title2: string;
    title2Ka: string;
    blurb: string;
    blurbKa: string;
    addressLabel: string;
    addressLabelKa: string;
    address: string;
    addressKa: string;
    callLabel: string;
    callLabelKa: string;
    phone: string;
    emailLabel: string;
    emailLabelKa: string;
    email: string;
  };
};

// Shape returned by Payload when querying `locale: "all"` — every
// `localized: true` leaf comes back as `{ en, ka }` (see the `localization`
// block in payload.config.ts). Non-localized leaves (image paths, phone,
// email) stay plain strings.
type L = { en: string; ka: string };

type ShowroomDoc = {
  hero: { tag: L; title1: L; title2: L; image: string };
  stats: { value: L; label: L }[];
  space: {
    kicker: L;
    title1: L;
    title2: L;
    p1: L;
    p2: L;
    bookViewingLabel: L;
  };
  gallery: {
    kicker: L;
    title: L;
    lead: L;
    bannerImage: string;
    bannerCaption: L;
    items: { image: string; caption: L }[];
  };
  display: { kicker: L; title: L; fullCatalogLabel: L };
  visit: {
    kicker: L;
    title1: L;
    title2: L;
    blurb: L;
    addressLabel: L;
    address: L;
    callLabel: L;
    phone: string;
    emailLabel: L;
    email: string;
  };
};

function mapDoc(doc: ShowroomDoc): ShowroomContent {
  return {
    hero: {
      tag: doc.hero.tag.en,
      tagKa: doc.hero.tag.ka,
      title1: doc.hero.title1.en,
      title1Ka: doc.hero.title1.ka,
      title2: doc.hero.title2.en,
      title2Ka: doc.hero.title2.ka,
      image: doc.hero.image,
    },
    stats: doc.stats.map((s) => ({
      value: s.value.en,
      valueKa: s.value.ka,
      label: s.label.en,
      labelKa: s.label.ka,
    })),
    space: {
      kicker: doc.space.kicker.en,
      kickerKa: doc.space.kicker.ka,
      title1: doc.space.title1.en,
      title1Ka: doc.space.title1.ka,
      title2: doc.space.title2.en,
      title2Ka: doc.space.title2.ka,
      p1: doc.space.p1.en,
      p1Ka: doc.space.p1.ka,
      p2: doc.space.p2.en,
      p2Ka: doc.space.p2.ka,
      bookViewingLabel: doc.space.bookViewingLabel.en,
      bookViewingLabelKa: doc.space.bookViewingLabel.ka,
    },
    gallery: {
      kicker: doc.gallery.kicker.en,
      kickerKa: doc.gallery.kicker.ka,
      title: doc.gallery.title.en,
      titleKa: doc.gallery.title.ka,
      lead: doc.gallery.lead.en,
      leadKa: doc.gallery.lead.ka,
      bannerImage: doc.gallery.bannerImage,
      bannerCaption: doc.gallery.bannerCaption.en,
      bannerCaptionKa: doc.gallery.bannerCaption.ka,
      items: doc.gallery.items.map((i) => ({
        image: i.image,
        caption: i.caption.en,
        captionKa: i.caption.ka,
      })),
    },
    display: {
      kicker: doc.display.kicker.en,
      kickerKa: doc.display.kicker.ka,
      title: doc.display.title.en,
      titleKa: doc.display.title.ka,
      fullCatalogLabel: doc.display.fullCatalogLabel.en,
      fullCatalogLabelKa: doc.display.fullCatalogLabel.ka,
    },
    visit: {
      kicker: doc.visit.kicker.en,
      kickerKa: doc.visit.kicker.ka,
      title1: doc.visit.title1.en,
      title1Ka: doc.visit.title1.ka,
      title2: doc.visit.title2.en,
      title2Ka: doc.visit.title2.ka,
      blurb: doc.visit.blurb.en,
      blurbKa: doc.visit.blurb.ka,
      addressLabel: doc.visit.addressLabel.en,
      addressLabelKa: doc.visit.addressLabel.ka,
      address: doc.visit.address.en,
      addressKa: doc.visit.address.ka,
      callLabel: doc.visit.callLabel.en,
      callLabelKa: doc.visit.callLabel.ka,
      phone: doc.visit.phone,
      emailLabel: doc.visit.emailLabel.en,
      emailLabelKa: doc.visit.emailLabel.ka,
      email: doc.visit.email,
    },
  };
}

export async function getShowroom(): Promise<ShowroomContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "showroom",
    locale: "all",
    depth: 0,
  });
  return mapDoc(doc as unknown as ShowroomDoc);
}
