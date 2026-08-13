import { getPayload } from "payload";
import config from "@payload-config";

// Server-only data access for the `home` Payload global. Maps the DB doc
// onto the shape HomeClient renders — mirrors src/lib/getProducts.ts.
export type HomeContent = {
  hero: {
    kicker: string;
    kickerKa: string;
    line1: string;
    line1Ka: string;
    line2: string;
    line2Ka: string;
    line3a: string;
    line3aKa: string;
    line3b: string;
    line3bKa: string;
    blurb: string;
    blurbKa: string;
    ctaLabel: string;
    ctaLabelKa: string;
    image: string;
  };
  stats: { value: string; valueKa: string; label: string; labelKa: string }[];
  inventory: {
    title: string;
    titleKa: string;
    lead: string;
    leadKa: string;
    viewAllLabel: string;
    viewAllLabelKa: string;
  };
  journey: {
    kicker: string;
    kickerKa: string;
    title: string;
    titleKa: string;
    lead: string;
    leadKa: string;
    steps: {
      n: string;
      title: string;
      titleKa: string;
      desc: string;
      descKa: string;
    }[];
  };
  workshop: {
    tag: string;
    tagKa: string;
    title: string;
    titleKa: string;
    blurb: string;
    blurbKa: string;
    scheduleVisitLabel: string;
    scheduleVisitLabelKa: string;
    image: string;
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
};

// Shape returned by Payload when querying `locale: "all"` — every
// `localized: true` leaf comes back as `{ en, ka }` instead of a plain
// string (see the `localization` block in payload.config.ts). Non-localized
// leaves (image paths, step numbers) stay plain strings.
type L = { en: string; ka: string };

type HomeDoc = {
  hero: {
    kicker: L;
    line1: L;
    line2: L;
    line3a: L;
    line3b: L;
    blurb: L;
    ctaLabel: L;
    image: string;
  };
  stats: { value: L; label: L }[];
  inventory: { title: L; lead: L; viewAllLabel: L };
  journey: {
    kicker: L;
    title: L;
    lead: L;
    steps: { n: string; title: L; desc: L }[];
  };
  workshop: {
    tag: L;
    title: L;
    blurb: L;
    scheduleVisitLabel: L;
    image: string;
  };
  booking: { kicker: L; title1: L; title2: L; blurb: L };
};

function mapDoc(doc: HomeDoc): HomeContent {
  return {
    hero: {
      kicker: doc.hero.kicker.en,
      kickerKa: doc.hero.kicker.ka,
      line1: doc.hero.line1.en,
      line1Ka: doc.hero.line1.ka,
      line2: doc.hero.line2.en,
      line2Ka: doc.hero.line2.ka,
      line3a: doc.hero.line3a.en,
      line3aKa: doc.hero.line3a.ka,
      line3b: doc.hero.line3b.en,
      line3bKa: doc.hero.line3b.ka,
      blurb: doc.hero.blurb.en,
      blurbKa: doc.hero.blurb.ka,
      ctaLabel: doc.hero.ctaLabel.en,
      ctaLabelKa: doc.hero.ctaLabel.ka,
      image: doc.hero.image,
    },
    stats: doc.stats.map((s) => ({
      value: s.value.en,
      valueKa: s.value.ka,
      label: s.label.en,
      labelKa: s.label.ka,
    })),
    inventory: {
      title: doc.inventory.title.en,
      titleKa: doc.inventory.title.ka,
      lead: doc.inventory.lead.en,
      leadKa: doc.inventory.lead.ka,
      viewAllLabel: doc.inventory.viewAllLabel.en,
      viewAllLabelKa: doc.inventory.viewAllLabel.ka,
    },
    journey: {
      kicker: doc.journey.kicker.en,
      kickerKa: doc.journey.kicker.ka,
      title: doc.journey.title.en,
      titleKa: doc.journey.title.ka,
      lead: doc.journey.lead.en,
      leadKa: doc.journey.lead.ka,
      steps: doc.journey.steps.map((s) => ({
        n: s.n,
        title: s.title.en,
        titleKa: s.title.ka,
        desc: s.desc.en,
        descKa: s.desc.ka,
      })),
    },
    workshop: {
      tag: doc.workshop.tag.en,
      tagKa: doc.workshop.tag.ka,
      title: doc.workshop.title.en,
      titleKa: doc.workshop.title.ka,
      blurb: doc.workshop.blurb.en,
      blurbKa: doc.workshop.blurb.ka,
      scheduleVisitLabel: doc.workshop.scheduleVisitLabel.en,
      scheduleVisitLabelKa: doc.workshop.scheduleVisitLabel.ka,
      image: doc.workshop.image,
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
  };
}

export async function getHome(): Promise<HomeContent> {
  const payload = await getPayload({ config });
  const doc = await payload.findGlobal({
    slug: "home",
    locale: "all",
    depth: 0,
  });
  return mapDoc(doc as unknown as HomeDoc);
}
