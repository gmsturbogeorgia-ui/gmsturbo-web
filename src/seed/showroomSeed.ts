// Default content for the `showroom` Payload global, seeded once so /admin
// and /showroom both start populated. Copied verbatim from the strings that
// previously lived in src/lib/i18n/dictionary.ts under the `showroom` key,
// plus the gallery captions and phone/email/address that were hardcoded in
// ShowroomClient.
//
// As in src/seed/homeSeed.ts, the `/images/…` values below are repo paths,
// not what gets stored — runSeed uploads each into the `media` collection
// and writes that doc's id, because the CMS image fields are uploads now.
import type { MediaResolver } from "./mediaSeed";

export const SHOWROOM_SEED = {
  hero: {
    tag: "Flagship · 71, Sakartvelos Ertianobistvis Mebrdzolta Street, Tbilisi",
    tagKa:
      "მთავარი დარბაზი · 71 საქართველოს ერთიანობისთვის მებრძოლთა ქუჩა, თბილისი",
    title1: "The",
    title1Ka: "სავიტრინო",
    title2: "showroom",
    title2Ka: "დარბაზი",
    image: "/images/showroom-reception-neon.jpeg",
  },
  stats: [
    {
      value: "Mon–Fri · 10:00–18:00",
      valueKa: "ორშ–პარ · 10:00–18:00",
      label: "Hours",
      labelKa: "სამუშაო საათები",
    },
    {
      value: "11:00–17:00",
      valueKa: "11:00–17:00",
      label: "Saturday",
      labelKa: "შაბათი",
    },
    {
      value: "By appointment",
      valueKa: "წინასწარი ჩაწერით",
      label: "Viewings",
      labelKa: "დათვალიერება",
    },
    {
      value: "On-site",
      valueKa: "ადგილზე",
      label: "Test fit",
      labelKa: "სატესტო მორგება",
    },
  ],
  gallery: {
    kicker: "Gallery",
    kickerKa: "გალერეა",
    title: "Inside the flagship",
    titleKa: "მთავარი დარბაზის შიგნით",
    lead: "Photographed on an ordinary Tuesday, no staging, no rendered shelves.",
    leadKa: "გადაღებულია ჩვეულებრივ სამშაბათს, დადგმის გარეშე.",
    bannerImage: "/images/gms-turbo-neon-sign.jpeg",
    bannerCaption: "71, Sakartvelos Ertianobistvis Mebrdzolta Street",
    bannerCaptionKa: "71 საქართველოს ერთიანობისთვის მებრძოლთა ქუჩა",
    items: [
      {
        image: "/images/showroom-stock-shelves.jpeg",
        caption: "Stock wall",
        captionKa: "საწყობის კედელი",
      },
      {
        image: "/images/showroom-stock-aisle.jpeg",
        caption: "The aisle",
        captionKa: "გასასვლელი",
      },
      {
        image: "/images/showroom-counter-wall.jpeg",
        caption: "The counter",
        captionKa: "დახლი",
      },
      {
        image: "/images/products/turbo-parts-display.jpeg",
        caption: "Display case",
        captionKa: "სავიტრინო კარადა",
      },
      {
        image: "/images/warehouse-stock.jpeg",
        caption: "Warehouse",
        captionKa: "საწყობი",
      },
      {
        image: "/images/showroom-display-minimal.jpeg",
        caption: "The plinth",
        captionKa: "სტენდი",
      },
    ],
  },
  display: {
    kicker: "On display",
    kickerKa: "გამოფენილი",
    title: "The collection",
    titleKa: "კოლექცია",
    fullCatalogLabel: "Full catalog",
    fullCatalogLabelKa: "სრული კატალოგი",
  },
  visit: {
    kicker: "Visit",
    kickerKa: "ვიზიტი",
    title1: "Walk in.",
    title1Ka: "შემოდით.",
    title2: "Spec out.",
    title2Ka: "დააზუსტეთ.",
    blurb:
      "No appointment required for browsing. For private viewings, test fits or competition consultations, reserve an hour with our lead engineer.",
    blurbKa:
      "დათვალიერებისთვის წინასწარი ჩაწერა საჭირო არ არის. პირადი ვიზიტების, სატესტო მორგებისა თუ სპორტული კონსულტაციისთვის დაჯავშნეთ საათი ჩვენს მთავარ ინჟინერთან.",
    addressLabel: "Address",
    addressLabelKa: "მისამართი",
    address: "71, Sakartvelos Ertianobistvis Mebrdzolta Street, Tbilisi 0163",
    addressKa: "71 საქართველოს ერთიანობისთვის მებრძოლთა ქუჩა, თბილისი 0163",
    callLabel: "Call",
    callLabelKa: "ზარი",
    phone: "+995 551 24 42 22",
    emailLabel: "Email",
    emailLabelKa: "ელფოსტა",
    email: "showroom@gmsturbo.ge",
  },
};

type L = { en: string; ka: string };
const locale = (en: string, ka: string): L => ({ en, ka });

/**
 * Projects the bilingual SHOWROOM_SEED pairs into the shape Payload's Local
 * API expects for a single `locale: "all"` write — every `localized: true`
 * leaf becomes `{ en, ka }`. See homeSeedAllLocales() in homeSeed.ts for why
 * this must be one write per doc rather than two locale-scoped calls
 * (arrays get their rows deleted and recreated on every write that touches
 * them, so `stats` and `gallery.items` would lose whichever locale was
 * written first).
 */
export function showroomSeedAllLocales(media: MediaResolver) {
  return {
    hero: {
      tag: locale(SHOWROOM_SEED.hero.tag, SHOWROOM_SEED.hero.tagKa),
      title1: locale(SHOWROOM_SEED.hero.title1, SHOWROOM_SEED.hero.title1Ka),
      title2: locale(SHOWROOM_SEED.hero.title2, SHOWROOM_SEED.hero.title2Ka),
      image: media(SHOWROOM_SEED.hero.image),
    },
    stats: SHOWROOM_SEED.stats.map((s) => ({
      value: locale(s.value, s.valueKa),
      label: locale(s.label, s.labelKa),
    })),
    gallery: {
      kicker: locale(
        SHOWROOM_SEED.gallery.kicker,
        SHOWROOM_SEED.gallery.kickerKa,
      ),
      title: locale(SHOWROOM_SEED.gallery.title, SHOWROOM_SEED.gallery.titleKa),
      lead: locale(SHOWROOM_SEED.gallery.lead, SHOWROOM_SEED.gallery.leadKa),
      bannerImage: media(SHOWROOM_SEED.gallery.bannerImage),
      bannerCaption: locale(
        SHOWROOM_SEED.gallery.bannerCaption,
        SHOWROOM_SEED.gallery.bannerCaptionKa,
      ),
      items: SHOWROOM_SEED.gallery.items.map((i) => ({
        image: media(i.image),
        caption: locale(i.caption, i.captionKa),
      })),
    },
    display: {
      kicker: locale(
        SHOWROOM_SEED.display.kicker,
        SHOWROOM_SEED.display.kickerKa,
      ),
      title: locale(SHOWROOM_SEED.display.title, SHOWROOM_SEED.display.titleKa),
      fullCatalogLabel: locale(
        SHOWROOM_SEED.display.fullCatalogLabel,
        SHOWROOM_SEED.display.fullCatalogLabelKa,
      ),
    },
    visit: {
      kicker: locale(SHOWROOM_SEED.visit.kicker, SHOWROOM_SEED.visit.kickerKa),
      title1: locale(SHOWROOM_SEED.visit.title1, SHOWROOM_SEED.visit.title1Ka),
      title2: locale(SHOWROOM_SEED.visit.title2, SHOWROOM_SEED.visit.title2Ka),
      blurb: locale(SHOWROOM_SEED.visit.blurb, SHOWROOM_SEED.visit.blurbKa),
      addressLabel: locale(
        SHOWROOM_SEED.visit.addressLabel,
        SHOWROOM_SEED.visit.addressLabelKa,
      ),
      address: locale(
        SHOWROOM_SEED.visit.address,
        SHOWROOM_SEED.visit.addressKa,
      ),
      callLabel: locale(
        SHOWROOM_SEED.visit.callLabel,
        SHOWROOM_SEED.visit.callLabelKa,
      ),
      phone: SHOWROOM_SEED.visit.phone,
      emailLabel: locale(
        SHOWROOM_SEED.visit.emailLabel,
        SHOWROOM_SEED.visit.emailLabelKa,
      ),
      email: SHOWROOM_SEED.visit.email,
    },
  };
}
