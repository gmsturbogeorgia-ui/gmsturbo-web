import { getPayload } from "payload";
import config from "@payload-config";

// Server-only data access for the `contact` Payload global. Maps the DB doc
// onto the shape ContactClient renders — mirrors src/lib/getHome.ts.
export type ContactContent = {
  hero: {
    tag: string;
    tagKa: string;
    title1: string;
    title1Ka: string;
    title2: string;
    title2Ka: string;
    blurb: string;
    blurbKa: string;
  };
  info: {
    phoneLabel: string;
    phoneLabelKa: string;
    phone: string;
    emailLabel: string;
    emailLabelKa: string;
    email: string;
    addressLabel: string;
    addressLabelKa: string;
    addressLine1: string;
    addressLine1Ka: string;
    addressLine2: string;
    addressLine2Ka: string;
    hoursLabel: string;
    hoursLabelKa: string;
    hoursVal: string;
    hoursValKa: string;
    saturdayLabel: string;
    saturdayLabelKa: string;
    saturdayVal: string;
    saturdayValKa: string;
  };
  booking: {
    kicker: string;
    kickerKa: string;
    title1: string;
    title1Ka: string;
    title2: string;
    title2Ka: string;
    blurb: string;
    blurbKa: string;
  };
  findUs: {
    kicker: string;
    kickerKa: string;
    title: string;
    titleKa: string;
    image: string;
    caption: string;
    captionKa: string;
  };
};

// Shape returned by Payload when querying `locale: "all"` — every
// `localized: true` leaf comes back as `{ en, ka }` (see the `localization`
// block in payload.config.ts). Non-localized leaves (phone, email, image
// paths) stay plain strings.
type L = { en: string; ka: string };

type ContactDoc = {
  hero: { tag: L; title1: L; title2: L; blurb: L };
  info: {
    phoneLabel: L;
    phone: string;
    emailLabel: L;
    email: string;
    addressLabel: L;
    addressLine1: L;
    addressLine2: L;
    hoursLabel: L;
    hoursVal: L;
    saturdayLabel: L;
    saturdayVal: L;
  };
  booking: { kicker: L; title1: L; title2: L; blurb: L };
  findUs: { kicker: L; title: L; image: string; caption: L };
};

function mapDoc(doc: ContactDoc): ContactContent {
  return {
    hero: {
      tag: doc.hero.tag.en,
      tagKa: doc.hero.tag.ka,
      title1: doc.hero.title1.en,
      title1Ka: doc.hero.title1.ka,
      title2: doc.hero.title2.en,
      title2Ka: doc.hero.title2.ka,
      blurb: doc.hero.blurb.en,
      blurbKa: doc.hero.blurb.ka,
    },
    info: {
      phoneLabel: doc.info.phoneLabel.en,
      phoneLabelKa: doc.info.phoneLabel.ka,
      phone: doc.info.phone,
      emailLabel: doc.info.emailLabel.en,
      emailLabelKa: doc.info.emailLabel.ka,
      email: doc.info.email,
      addressLabel: doc.info.addressLabel.en,
      addressLabelKa: doc.info.addressLabel.ka,
      addressLine1: doc.info.addressLine1.en,
      addressLine1Ka: doc.info.addressLine1.ka,
      addressLine2: doc.info.addressLine2.en,
      addressLine2Ka: doc.info.addressLine2.ka,
      hoursLabel: doc.info.hoursLabel.en,
      hoursLabelKa: doc.info.hoursLabel.ka,
      hoursVal: doc.info.hoursVal.en,
      hoursValKa: doc.info.hoursVal.ka,
      saturdayLabel: doc.info.saturdayLabel.en,
      saturdayLabelKa: doc.info.saturdayLabel.ka,
      saturdayVal: doc.info.saturdayVal.en,
      saturdayValKa: doc.info.saturdayVal.ka,
    },
    booking: {
      kicker: doc.booking.kicker.en,
      kickerKa: doc.booking.kicker.ka,
      title1: doc.booking.title1.en,
      title1Ka: doc.booking.title1.ka,
      title2: doc.booking.title2.en,
      title2Ka: doc.booking.title2.ka,
      blurb: doc.booking.blurb.en,
      blurbKa: doc.booking.blurb.ka,
    },
    findUs: {
      kicker: doc.findUs.kicker.en,
      kickerKa: doc.findUs.kicker.ka,
      title: doc.findUs.title.en,
      titleKa: doc.findUs.title.ka,
      image: doc.findUs.image,
      caption: doc.findUs.caption.en,
      captionKa: doc.findUs.caption.ka,
    },
  };
}

export async function getContact(): Promise<ContactContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "contact",
    locale: "all",
    depth: 0,
  });
  return mapDoc(doc as unknown as ContactDoc);
}
