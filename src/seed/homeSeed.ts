import type { MediaResolver } from "./mediaSeed";

// Default content for the `home` Payload global, seeded once so /admin and
// the live site both start populated. Copied verbatim from the strings that
// previously lived in src/lib/i18n/dictionary.ts under the `home` key and
// the process `steps` array in src/app/HomeClient.tsx.
//
// The `image` values stay written as `/images/…` paths here because that's
// where the source files live in the repo. They are not what gets stored:
// runSeed uploads each one into the `media` collection and swaps the path
// for that media doc's id, since every image field in the CMS is an upload
// relationship (see src/seed/mediaSeed.ts).
export const HOME_SEED = {
  hero: {
    kicker: "Turbocharger engineering · Tbilisi, est. 2014",
    kickerKa: "ტურბოკომპრესორების ინჟინერია · თბილისი, 2014 წლიდან",
    line1: "Give your",
    line1Ka: "აჩუქე შენს",
    line2: "engine a",
    line2Ka: "ძრავას",
    line3a: "second",
    line3aKa: "მეორე",
    line3b: "life.",
    line3bKa: "სიცოცხლე.",
    blurb:
      "Sales, diagnostics, rebuilds and performance turbos — specced, balanced and bench-tested by the engineers who assemble them.",
    blurbKa:
      "გაყიდვა, დიაგნოსტიკა, აღდგენა და წარმადობის ტურბოები — შერჩეული, დაბალანსებული და სტენდზე ტესტირებული იმავე ინჟინრების მიერ, ვინც მათ აწყობს.",
    ctaLabel: "Browse the catalog",
    ctaLabelKa: "კატალოგის დათვალიერება",
    image: "/images/showroom-interior-wide.jpeg",
  },
  stats: [
    { value: "2014", valueKa: "2014", label: "Established", labelKa: "დაარსდა" },
    {
      value: "1,400+",
      valueKa: "1,400+",
      label: "Units rebuilt",
      labelKa: "აღდგენილი ერთეული",
    },
    {
      value: "24h",
      valueKa: "24 სთ",
      label: "Average turnaround",
      labelKa: "საშუალო ვადა",
    },
    {
      value: "24 mo",
      valueKa: "24 თვე",
      label: "Warranty",
      labelKa: "გარანტია",
    },
  ],
  inventory: {
    title: "Built and ready to ship",
    titleKa: "აწყობილი და გასაგზავნად მზადაა",
    lead: "A working selection from the floor. Every unit is balanced, pressure-tested and sealed before it leaves the bench.",
    leadKa:
      "შერჩევა სამუშაო დარბაზიდან. ყოველი ერთეული დაბალანსებულია, წნევაზე შემოწმებული და დალუქული სტენდიდან გასვლამდე.",
    viewAllLabel: "View all products",
    viewAllLabelKa: "ყველა პროდუქტის ნახვა",
  },
  journey: {
    kicker: "The process",
    kickerKa: "პროცესი",
    title: "From fault scan to sealed delivery",
    titleKa: "ხარვეზების სკანირებიდან დალუქულ მიწოდებამდე",
    lead: "Six stages, one bench, the same engineers throughout. You get a signed report at every hand-off.",
    leadKa:
      "ექვსი ეტაპი, ერთი სტენდი, იგივე ინჟინრები ბოლომდე. ყოველ ეტაპზე იღებთ ხელმოწერილ ანგარიშს.",
    steps: [
      {
        n: "01",
        title: "Diagnostics",
        titleKa: "დიაგნოსტიკა",
        desc: "Computerised fault scan, boost and pressure analysis.",
        descKa:
          "კომპიუტერული ხარვეზების სკანირება, დატენვისა და წნევის ანალიზი.",
      },
      {
        n: "02",
        title: "Inspection",
        titleKa: "ინსპექცია",
        desc: "Disassembly, wear mapping, compressor and turbine evaluation.",
        descKa: "დაშლა, ცვეთის რუკირება, კომპრესორისა და ტურბინის შეფასება.",
      },
      {
        n: "03",
        title: "Repair",
        titleKa: "შეკეთება",
        desc: "Machining, shaft balancing, seal and bearing replacement.",
        descKa:
          "დამუშავება, ლილვის დაბალანსება, საცობებისა და საკისრების ჩანაცვლება.",
      },
      {
        n: "04",
        title: "Rebuild",
        titleKa: "აღდგენა",
        desc: "OEM-spec reassembly with new core internals.",
        descKa: "OEM-სპეც აწყობა ახალი შიდა ნაწილებით.",
      },
      {
        n: "05",
        title: "Testing",
        titleKa: "ტესტირება",
        desc: "VSR bench balancing and live pressure verification.",
        descKa: "VSR სტენდზე დაბალანსება და წნევის რეალურ დროში შემოწმება.",
      },
      {
        n: "06",
        title: "Delivery",
        titleKa: "მიწოდება",
        desc: "Documented, sealed and shipped Caucasus-wide.",
        descKa: "დოკუმენტირებული, დალუქული და გაგზავნილი მთელ კავკასიაში.",
      },
    ],
  },
  workshop: {
    tag: "Inside the workshop",
    tagKa: "სახელოსნოს შიგნით",
    title: "A garage built for engineers, not salesmen.",
    titleKa: "გარაჟი აშენებულია ინჟინრებისთვის, არა გამყიდველებისთვის.",
    blurb:
      "CNC machining, VSR balancing rigs, ultrasonic cleaning lines and full flow-bench testing — under one roof in central Tbilisi.",
    blurbKa:
      "CNC დამუშავება, VSR საბალანსო სტენდები, ულტრაბგერითი გაწმენდის ხაზები და სრული ნაკადის სტენდზე ტესტირება — ერთი სახურავის ქვეშ, თბილისის ცენტრში.",
    scheduleVisitLabel: "Schedule a visit",
    scheduleVisitLabelKa: "ვიზიტის დაგეგმვა",
    image: "/images/warehouse-stock.jpeg",
  },
  booking: {
    kicker: "Talk to an engineer",
    kickerKa: "ესაუბრე ინჟინერს",
    title1: "Ready to",
    title1Ka: "მზად ხარ",
    title2: "spec your build?",
    title2Ka: "პროექტის დასაზუსტებლად?",
    blurb:
      "Book a call with our technical team, or reach us directly — we'll confirm fitment, lead time and price, usually within one business day.",
    blurbKa:
      "დაჯავშნეთ ზარი ჩვენს ტექნიკურ გუნდთან ან პირდაპირ დაგვიკავშირდით — დავადასტურებთ თავსებადობას, ვადებსა და ფასს, ჩვეულებრივ ერთ სამუშაო დღეში.",
  },
};

type L = { en: string; ka: string };
const locale = (en: string, ka: string): L => ({ en, ka });

/**
 * Projects the bilingual HOME_SEED pairs (`kicker`/`kickerKa`, …) into the
 * shape Payload's Local API expects for a single `locale: "all"` write:
 * every `localized: true` leaf becomes `{ en, ka }`, written in one call.
 *
 * This matters specifically for the `stats` and `journey.steps` arrays:
 * Payload's Postgres adapter deletes and recreates ALL of an array's rows
 * on every write that touches it, regardless of which locale that write
 * targets. Two sequential single-locale `updateGlobal` calls (the first
 * version of this function) silently wiped the first locale's array data —
 * the second call's row-recreation had no en text to carry forward. Folding
 * both locales into one write sidesteps that entirely: each row is created
 * once, with both locale companion rows attached from the start.
 */
export function homeSeedAllLocales(media: MediaResolver) {
  return {
    hero: {
      kicker: locale(HOME_SEED.hero.kicker, HOME_SEED.hero.kickerKa),
      line1: locale(HOME_SEED.hero.line1, HOME_SEED.hero.line1Ka),
      line2: locale(HOME_SEED.hero.line2, HOME_SEED.hero.line2Ka),
      line3a: locale(HOME_SEED.hero.line3a, HOME_SEED.hero.line3aKa),
      line3b: locale(HOME_SEED.hero.line3b, HOME_SEED.hero.line3bKa),
      blurb: locale(HOME_SEED.hero.blurb, HOME_SEED.hero.blurbKa),
      ctaLabel: locale(HOME_SEED.hero.ctaLabel, HOME_SEED.hero.ctaLabelKa),
      image: media(HOME_SEED.hero.image),
    },
    stats: HOME_SEED.stats.map((s) => ({
      value: locale(s.value, s.valueKa),
      label: locale(s.label, s.labelKa),
    })),
    inventory: {
      title: locale(HOME_SEED.inventory.title, HOME_SEED.inventory.titleKa),
      lead: locale(HOME_SEED.inventory.lead, HOME_SEED.inventory.leadKa),
      viewAllLabel: locale(
        HOME_SEED.inventory.viewAllLabel,
        HOME_SEED.inventory.viewAllLabelKa,
      ),
    },
    journey: {
      kicker: locale(HOME_SEED.journey.kicker, HOME_SEED.journey.kickerKa),
      title: locale(HOME_SEED.journey.title, HOME_SEED.journey.titleKa),
      lead: locale(HOME_SEED.journey.lead, HOME_SEED.journey.leadKa),
      steps: HOME_SEED.journey.steps.map((s) => ({
        n: s.n,
        title: locale(s.title, s.titleKa),
        desc: locale(s.desc, s.descKa),
      })),
    },
    workshop: {
      tag: locale(HOME_SEED.workshop.tag, HOME_SEED.workshop.tagKa),
      title: locale(HOME_SEED.workshop.title, HOME_SEED.workshop.titleKa),
      blurb: locale(HOME_SEED.workshop.blurb, HOME_SEED.workshop.blurbKa),
      scheduleVisitLabel: locale(
        HOME_SEED.workshop.scheduleVisitLabel,
        HOME_SEED.workshop.scheduleVisitLabelKa,
      ),
      image: media(HOME_SEED.workshop.image),
    },
    booking: {
      kicker: locale(HOME_SEED.booking.kicker, HOME_SEED.booking.kickerKa),
      title1: locale(HOME_SEED.booking.title1, HOME_SEED.booking.title1Ka),
      title2: locale(HOME_SEED.booking.title2, HOME_SEED.booking.title2Ka),
      blurb: locale(HOME_SEED.booking.blurb, HOME_SEED.booking.blurbKa),
    },
  };
}
