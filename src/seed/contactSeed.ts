// Default content for the `contact` Payload global, seeded once so /admin
// and /contact both start populated. Copied verbatim from the strings that
// previously lived in src/lib/i18n/dictionary.ts under the `contact` key,
// plus the phone/email/address values that were hardcoded in ContactClient.
export const CONTACT_SEED = {
  hero: {
    tag: "Tsereteli Ave 114, Tbilisi",
    tagKa: "წერეთლის გამზ. 114, თბილისი",
    title1: "Contact us",
    title1Ka: "დაგვიკავშირდით",
    title2: "or book a callback",
    title2Ka: "ან დაჯავშნეთ ზარი",
    blurb:
      "Call, message or visit the workshop. For a spec consultation or a rebuild quote, book a callback and our engineers will reach out.",
    blurbKa:
      "დაგვირეკეთ, მოგვწერეთ ან ეწვიეთ სახელოსნოს. კონსულტაციის ან აღდგენის ფასის მისაღებად დაჯავშნეთ გამოძახება და ჩვენი ინჟინრები დაგიკავშირდებიან.",
  },
  info: {
    phoneLabel: "Phone",
    phoneLabelKa: "ტელეფონი",
    phone: "+995 551 24 42 22",
    emailLabel: "Email",
    emailLabelKa: "ელფოსტა",
    email: "showroom@gmsturbo.ge",
    addressLabel: "Address",
    addressLabelKa: "მისამართი",
    addressLine1: "Tsereteli Ave 114",
    addressLine1Ka: "წერეთლის გამზ. 114",
    addressLine2: "Tbilisi 0119",
    addressLine2Ka: "თბილისი 0119",
    hoursLabel: "Hours",
    hoursLabelKa: "სამუშაო საათები",
    hoursVal: "Mon–Fri · 10:00–18:00",
    hoursValKa: "ორშ–პარ · 10:00–18:00",
    saturdayLabel: "Saturday",
    saturdayLabelKa: "შაბათი",
    saturdayVal: "11:00–17:00",
    saturdayValKa: "11:00–17:00",
  },
  booking: {
    kicker: "Talk to us",
    kickerKa: "მოგვწერეთ",
    title1: "Prefer we",
    title1Ka: "გირჩევნიათ",
    title2: "call you?",
    title2Ka: "ჩვენ დაგირეკოთ?",
    blurb:
      "Leave your number and what you're building. Our technical team will call you back during workshop hours to spec your build.",
    blurbKa:
      "დატოვეთ თქვენი ნომერი და რას აწყობთ. ჩვენი ტექნიკური გუნდი დაგირეკავთ სამუშაო საათებში პროექტის დასაზუსტებლად.",
  },
  findUs: {
    kicker: "Find us",
    kickerKa: "მოგვძებნეთ",
    title: "The workshop",
    titleKa: "სახელოსნო",
    mapQuery: "41.697529,44.886512",
    mapZoom: 16,
    caption: "Tsereteli Ave 114 · Tbilisi",
    captionKa: "წერეთლის გამზ. 114 · თბილისი",
  },
};

type L = { en: string; ka: string };
const locale = (en: string, ka: string): L => ({ en, ka });

/**
 * Projects the bilingual CONTACT_SEED pairs into the shape Payload's Local
 * API expects for a single `locale: "all"` write — every `localized: true`
 * leaf becomes `{ en, ka }`. See homeSeedAllLocales() in homeSeed.ts for why
 * this must be one write per doc rather than two locale-scoped calls.
 */
export function contactSeedAllLocales() {
  return {
    hero: {
      tag: locale(CONTACT_SEED.hero.tag, CONTACT_SEED.hero.tagKa),
      title1: locale(CONTACT_SEED.hero.title1, CONTACT_SEED.hero.title1Ka),
      title2: locale(CONTACT_SEED.hero.title2, CONTACT_SEED.hero.title2Ka),
      blurb: locale(CONTACT_SEED.hero.blurb, CONTACT_SEED.hero.blurbKa),
    },
    info: {
      phoneLabel: locale(
        CONTACT_SEED.info.phoneLabel,
        CONTACT_SEED.info.phoneLabelKa,
      ),
      phone: CONTACT_SEED.info.phone,
      emailLabel: locale(
        CONTACT_SEED.info.emailLabel,
        CONTACT_SEED.info.emailLabelKa,
      ),
      email: CONTACT_SEED.info.email,
      addressLabel: locale(
        CONTACT_SEED.info.addressLabel,
        CONTACT_SEED.info.addressLabelKa,
      ),
      addressLine1: locale(
        CONTACT_SEED.info.addressLine1,
        CONTACT_SEED.info.addressLine1Ka,
      ),
      addressLine2: locale(
        CONTACT_SEED.info.addressLine2,
        CONTACT_SEED.info.addressLine2Ka,
      ),
      hoursLabel: locale(
        CONTACT_SEED.info.hoursLabel,
        CONTACT_SEED.info.hoursLabelKa,
      ),
      hoursVal: locale(
        CONTACT_SEED.info.hoursVal,
        CONTACT_SEED.info.hoursValKa,
      ),
      saturdayLabel: locale(
        CONTACT_SEED.info.saturdayLabel,
        CONTACT_SEED.info.saturdayLabelKa,
      ),
      saturdayVal: locale(
        CONTACT_SEED.info.saturdayVal,
        CONTACT_SEED.info.saturdayValKa,
      ),
    },
    booking: {
      kicker: locale(CONTACT_SEED.booking.kicker, CONTACT_SEED.booking.kickerKa),
      title1: locale(
        CONTACT_SEED.booking.title1,
        CONTACT_SEED.booking.title1Ka,
      ),
      title2: locale(
        CONTACT_SEED.booking.title2,
        CONTACT_SEED.booking.title2Ka,
      ),
      blurb: locale(CONTACT_SEED.booking.blurb, CONTACT_SEED.booking.blurbKa),
    },
    findUs: {
      kicker: locale(CONTACT_SEED.findUs.kicker, CONTACT_SEED.findUs.kickerKa),
      title: locale(CONTACT_SEED.findUs.title, CONTACT_SEED.findUs.titleKa),
      mapQuery: CONTACT_SEED.findUs.mapQuery,
      mapZoom: CONTACT_SEED.findUs.mapZoom,
      caption: locale(
        CONTACT_SEED.findUs.caption,
        CONTACT_SEED.findUs.captionKa,
      ),
    },
  };
}
