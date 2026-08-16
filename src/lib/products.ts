// Seed defaults for the `categories` and `vehicles` collections — these are
// no longer the authoritative list. Both are editable from /admin now (see
// src/collections/Categories.ts), so anything reading a category or make at
// runtime gets it from the DB via src/lib/getTaxonomies.ts; this array only
// says what a fresh database starts with. `label`/`labelKa` seed the
// localized display name, `value` is the stable key products are filed under.
export const CATEGORY_SEED = [
  { value: "HYBRID", label: "Hybrid", labelKa: "ჰიბრიდი" },
  { value: "BILLET", label: "Billet", labelKa: "ბილეტი" },
  { value: "OEM REPLACEMENT", label: "OEM replacement", labelKa: "OEM ჩანაცვლება" },
  { value: "COMPETITION", label: "Competition", labelKa: "სპორტული" },
] as const;

// Marques keep their own house styling in both languages (BMW and VW are
// genuinely initialisms; Porsche and Subaru are not), so most labels match.
export const VEHICLE_SEED = [
  { value: "BMW", label: "BMW", labelKa: "BMW", popular: true },
  { value: "AUDI", label: "Audi", labelKa: "Audi", popular: true },
  { value: "VW", label: "VW", labelKa: "VW", popular: false },
  { value: "MERCEDES", label: "Mercedes", labelKa: "Mercedes", popular: true },
  { value: "PORSCHE", label: "Porsche", labelKa: "Porsche", popular: true },
  { value: "SUBARU", label: "Subaru", labelKa: "Subaru", popular: false },
  { value: "TOYOTA", label: "Toyota", labelKa: "Toyota", popular: false },
  { value: "NISSAN", label: "Nissan", labelKa: "Nissan", popular: false },
] as const;

// Categories and makes are user-editable rows now, not a closed set, so these
// are plain strings holding a taxonomy `value`. They stay named types because
// every filter/search signature in the app reads better for it.
export type Category = string;
export type Vehicle = string;

// Real GMS Turbo studio photography, shared per catalog category. The first
// entry is the product's lead image; the rest populate the detail gallery.
// Files live under /public/images/products/.
const CATEGORY_IMAGES: Record<Exclude<Category, "ALL">, string[]> = {
  HYBRID: [
    "/images/products/gms-turbo-silver.jpeg",
    "/images/products/turbo-cartridge-core.jpeg",
    "/images/products/turbo-cartridge-kit.jpeg",
    "/images/products/turbo-kit-boxed.jpeg",
  ],
  BILLET: [
    "/images/products/gms-turbo-studio.jpeg",
    "/images/products/turbo-cartridge-core.jpeg",
    "/images/products/turbo-parts-display.jpeg",
    "/images/products/turbo-kit-boxed.jpeg",
  ],
  COMPETITION: [
    "/images/products/gms-turbo-studio.jpeg",
    "/images/products/turbo-cartridge-core.jpeg",
    "/images/products/turbo-parts-display.jpeg",
    "/images/products/turbo-cartridge-kit.jpeg",
  ],
  "OEM REPLACEMENT": [
    "/images/products/oem-vgt-diesel.jpeg",
    "/images/products/turbo-cartridge-core.jpeg",
    "/images/products/turbo-kit-boxed.jpeg",
    "/images/products/turbo-box-packaging.jpeg",
  ],
};

// The lead photo for a category (also used as each product's card image).
export function mainImageFor(category: Exclude<Category, "ALL">): string {
  return CATEGORY_IMAGES[category][0];
}

function galleryFor(category: Exclude<Category, "ALL">): string[] {
  return CATEGORY_IMAGES[category];
}

// A product as the site renders it: text already in the page's language,
// because the locale is a URL segment and getProducts queries Payload for
// that one locale (see src/lib/getProducts.ts).
export type Product = {
  id: string;
  name: string;
  code: string;
  category: Category;
  vehicles: Vehicle[];
  fitments: { make: string; model: string; years: string; engine: string }[];
  boost: number;
  hp: number;
  price: number;
  img: string;
  gallery: string[];
  stock: "IN STOCK" | "MADE TO ORDER" | "LOW STOCK";
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
};

// The seed carries both languages at once, since one seed run writes the en
// and ka rows together (see the note in src/seed/runSeed.ts about Payload's
// Postgres adapter recreating array rows per write).
export type ProductSeed = Omit<Product, "tagline" | "description"> & {
  tagline: string;
  taglineKa: string;
  description: string;
  descriptionKa: string;
};

export const PRODUCTS: ProductSeed[] = [
  {
    id: "t450",
    name: "GMS T-450 HYBRID",
    code: "GMS-T450",
    category: "HYBRID",
    vehicles: ["BMW", "AUDI", "VW"],
    fitments: [
      {
        make: "BMW",
        model: "335i / 135i (N54)",
        years: "2007–2013",
        engine: "3.0L I6 Twin-Turbo",
      },
      {
        make: "Audi",
        model: "S3 / TT-S (EA113)",
        years: "2008–2012",
        engine: "2.0 TFSI",
      },
      {
        make: "VW",
        model: "Golf R / GTI Mk6",
        years: "2009–2013",
        engine: "2.0 TSI",
      },
    ],
    boost: 28,
    hp: 480,
    price: 1850,
    img: mainImageFor("HYBRID"),
    gallery: galleryFor("HYBRID"),
    stock: "IN STOCK",
    tagline: "Street-legal hybrid built on a reinforced OEM core.",
    taglineKa: "ქუჩისთვის ლეგალური ჰიბრიდი, აგებული გამაგრებულ OEM ბირთვზე.",
    description:
      "The T-450 pairs a billet 6+6 compressor wheel with a balanced OEM-spec CHRA, delivering reliable daily performance with race-grade response. Every unit is VSR-balanced and pressure-tested before leaving the bench.",
    descriptionKa:
      "T-450 აერთიანებს ბილეტის 6+6 კომპრესორის ბორბალს დაბალანსებულ OEM-სპეც CHRA-სთან, რაც უზრუნველყოფს საიმედო ყოველდღიურ წარმადობას სარბოლო დონის გამოხმაურებით. ყოველი ერთეული VSR-დაბალანსებული და წნევაზე ტესტირებულია სამუშაო მაგიდის დატოვებამდე.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 6+6, 49.5/65 mm" },
      { label: "Turbine Wheel", value: "Inconel 9-blade, 56 mm" },
      { label: "Housing", value: "Cast iron, ported" },
      { label: "Max Boost", value: "28 PSI" },
      { label: "Crank HP Potential", value: "480 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "360° thrust journal" },
      { label: "Warranty", value: "24 months" },
    ],
  },
  {
    id: "r6x",
    name: "ULTRA-BOOST R6X",
    code: "UB-R6X",
    category: "BILLET",
    vehicles: ["AUDI", "PORSCHE"],
    fitments: [
      {
        make: "Audi",
        model: "RS3 / TT-RS (DAZA)",
        years: "2017–2024",
        engine: "2.5 TFSI I5",
      },
      {
        make: "Porsche",
        model: "Macan 2.0T",
        years: "2017–2021",
        engine: "2.0 TFSI",
      },
    ],
    boost: 34,
    hp: 680,
    price: 3200,
    img: mainImageFor("BILLET"),
    gallery: galleryFor("BILLET"),
    stock: "LOW STOCK",
    tagline:
      "Full billet construction. Built for the dyno, tuned for the street.",
    taglineKa:
      "სრულად ბილეტის კონსტრუქცია. აგებული დინოსთვის, მორგებული ქუჩისთვის.",
    description:
      "R6X uses a fully CNC-machined billet wheel set and a high-flow exhaust housing engineered for sub-2,800 RPM spool. Targets 600–680 crank HP on E85 with proper supporting mods.",
    descriptionKa:
      "R6X იყენებს სრულად CNC-დამუშავებულ ბილეტის ბორბლების ნაკრებს და მაღალნაკადიან გამონაბოლქვის კორპუსს, დაპროექტებულს 2,800 ბრ/წთ-ზე დაბალ დატრიალებისთვის. მიზანია 600–680 ცხენის ძალა კრანკზე E85-ზე, შესაბამისი დამატებითი მოდიფიკაციებით.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 7+7, 58/72 mm" },
      { label: "Turbine Wheel", value: "Titanium-Aluminide, 62 mm" },
      { label: "Housing", value: "0.82 A/R V-band" },
      { label: "Max Boost", value: "34 PSI" },
      { label: "Crank HP Potential", value: "680 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "Dual ceramic ball" },
      { label: "Warranty", value: "12 months" },
    ],
  },
  {
    id: "kit89",
    name: "KIT-89 COMPETITION",
    code: "K89-COMP",
    category: "COMPETITION",
    vehicles: ["SUBARU", "NISSAN"],
    fitments: [
      {
        make: "Subaru",
        model: "WRX STI (EJ257)",
        years: "2004–2021",
        engine: "2.5L Boxer",
      },
      {
        make: "Nissan",
        model: "GT-R R35 (VR38)",
        years: "2008–2024",
        engine: "3.8L V6 Twin-Turbo",
      },
    ],
    boost: 42,
    hp: 920,
    price: 4495,
    img: mainImageFor("COMPETITION"),
    gallery: galleryFor("COMPETITION"),
    stock: "MADE TO ORDER",
    tagline: "Time-attack spec. No compromises.",
    taglineKa: "თაიმ-ატაკის სპეციფიკაცია. კომპრომისების გარეშე.",
    description:
      "Built per build sheet. Twin ceramic ball bearings, divided T4 entry and a V-band discharge for serious motorsport applications. Lead time 3–4 weeks.",
    descriptionKa:
      "აგებულია ინდივიდუალური სამშენებლო ფურცლის მიხედვით. ორმაგი კერამიკული ბურთულა საკისრები, გაყოფილი T4 შესასვლელი და V-band გამონატანი სერიოზული საავტომობილო სპორტისთვის. მოლოდინის ვადა 3–4 კვირა.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 8+0 extended-tip, 67/88 mm" },
      { label: "Turbine Wheel", value: "Inconel 11-blade, 74 mm" },
      { label: "Housing", value: "Divided T4, 1.05 A/R" },
      { label: "Max Boost", value: "42 PSI" },
      { label: "Crank HP Potential", value: "920 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "Dual ceramic ball" },
      { label: "Warranty", value: "Competition use — none" },
    ],
  },
  {
    id: "oem320",
    name: "OEM-320 REPLACEMENT",
    code: "OEM-320",
    category: "OEM REPLACEMENT",
    vehicles: ["MERCEDES", "BMW"],
    fitments: [
      {
        make: "Mercedes",
        model: "C220d / E220d (OM651)",
        years: "2013–2020",
        engine: "2.1 CDI",
      },
      {
        make: "BMW",
        model: "320d / 520d (N47)",
        years: "2010–2016",
        engine: "2.0d",
      },
    ],
    boost: 18,
    hp: 280,
    price: 980,
    img: mainImageFor("OEM REPLACEMENT"),
    gallery: galleryFor("OEM REPLACEMENT"),
    stock: "IN STOCK",
    tagline: "OE-spec replacement, built right the first time.",
    taglineKa: "OE-სპეც ჩანაცვლება, სწორად აწყობილი პირველივე ჯერზე.",
    description:
      "Direct replacement for OE units. Balanced CHRA, new actuator and gaskets included. Plug-and-play installation.",
    descriptionKa:
      "პირდაპირი ჩანაცვლება OE ერთეულებისთვის. დაბალანსებული CHRA, ახალი აქტუატორი და საცობები შედის კომპლექტში. მონტაჟი — ჩართე და გამოიყენე.",
    specs: [
      { label: "Compressor Wheel", value: "OE 6+6, 41/55 mm" },
      { label: "Turbine Wheel", value: "OE-spec 9-blade, 49 mm" },
      { label: "Housing", value: "Variable geometry, OE casting" },
      { label: "Max Boost", value: "18 PSI" },
      { label: "Crank HP Potential", value: "280 HP" },
      { label: "Cooling", value: "Oil" },
      { label: "Bearing System", value: "Journal" },
      { label: "Warranty", value: "24 months" },
    ],
  },
  {
    id: "tdx",
    name: "TDX-700 BILLET",
    code: "TDX-700",
    category: "BILLET",
    vehicles: ["TOYOTA", "NISSAN", "SUBARU"],
    fitments: [
      {
        make: "Toyota",
        model: "Supra A80 (2JZ-GTE)",
        years: "1993–2002",
        engine: "3.0L I6",
      },
      {
        make: "Nissan",
        model: "Skyline R34 GT-R (RB26)",
        years: "1999–2002",
        engine: "2.6L I6",
      },
      {
        make: "Subaru",
        model: "WRX STI (EJ25)",
        years: "2004–2021",
        engine: "2.5L Boxer",
      },
    ],
    boost: 36,
    hp: 720,
    price: 3650,
    img: mainImageFor("BILLET"),
    gallery: galleryFor("BILLET"),
    stock: "IN STOCK",
    tagline: "JDM legend, billet-grade rebuild.",
    taglineKa: "JDM ლეგენდა, ბილეტის დონის აღდგენა.",
    description:
      "Drop-in performance upgrade for inline-six legends. Billet wheel, ceramic bearings, T4 flange.",
    descriptionKa:
      "პირდაპირ დასაყენებელი წარმადობის განახლება ინლაინ-ექვსცილინდრიანი ლეგენდებისთვის. ბილეტის ბორბალი, კერამიკული საკისრები, T4 ფლანეცი.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 7+7, 62/76 mm" },
      { label: "Turbine Wheel", value: "Inconel 10-blade, 64 mm" },
      { label: "Housing", value: "T4 0.82 A/R" },
      { label: "Max Boost", value: "36 PSI" },
      { label: "Crank HP Potential", value: "720 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "Ceramic ball" },
      { label: "Warranty", value: "12 months" },
    ],
  },
  {
    id: "hyb220",
    name: "HYBRID 220 STAGE 2",
    code: "HYB-220",
    category: "HYBRID",
    vehicles: ["VW", "AUDI"],
    fitments: [
      {
        make: "VW",
        model: "Golf GTI Mk7 (EA888)",
        years: "2014–2020",
        engine: "2.0 TSI",
      },
      {
        make: "Audi",
        model: "S3 8V (CJXC)",
        years: "2014–2020",
        engine: "2.0 TFSI",
      },
    ],
    boost: 26,
    hp: 410,
    price: 1620,
    img: mainImageFor("HYBRID"),
    gallery: galleryFor("HYBRID"),
    stock: "IN STOCK",
    tagline: "Plug-and-play Stage 2 upgrade for EA888.",
    taglineKa: "ჩართე და გამოიყენე — Stage 2 განახლება EA888-სთვის.",
    description:
      "Bolt-on hybrid using OE housing with upgraded billet wheel and reinforced shaft. Pair with a Stage 2 tune for 380–410 HP.",
    descriptionKa:
      "ჩამოსაკიდი ჰიბრიდი OE კორპუსით, განახლებული ბილეტის ბორბლითა და გამაგრებული ლილვით. შეუთავსეთ Stage 2 ტიუნინგს 380–410 ცხენის ძალისთვის.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 6+6, 48/63 mm" },
      { label: "Turbine Wheel", value: "Inconel 9-blade, 52 mm" },
      { label: "Housing", value: "OE casting, ported" },
      { label: "Max Boost", value: "26 PSI" },
      { label: "Crank HP Potential", value: "410 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "360° journal" },
      { label: "Warranty", value: "24 months" },
    ],
  },
  {
    id: "race9",
    name: "RACE-9 TWIN SCROLL",
    code: "R9-TS",
    category: "COMPETITION",
    vehicles: ["PORSCHE", "BMW"],
    fitments: [
      {
        make: "Porsche",
        model: "911 GT2 RS (9A1)",
        years: "2010–2019",
        engine: "3.6L Flat-6",
      },
      {
        make: "BMW",
        model: "M3/M4 (S55)",
        years: "2014–2020",
        engine: "3.0L I6 TT",
      },
    ],
    boost: 38,
    hp: 820,
    price: 5200,
    img: mainImageFor("COMPETITION"),
    gallery: galleryFor("COMPETITION"),
    stock: "MADE TO ORDER",
    tagline: "Twin-scroll architecture. Built for circuit work.",
    taglineKa: "ორმაგი სპირალის არქიტექტურა. აგებული ტრასისთვის.",
    description:
      "Twin-scroll exhaust housing keeps spool razor-sharp under load. Built per application with custom A/R selection.",
    descriptionKa:
      "ორმაგი სპირალის გამონაბოლქვის კორპუსი ინარჩუნებს სწრაფ დატრიალებას დატვირთვის ქვეშ. აგებულია გამოყენების მიხედვით, ინდივიდუალური A/R შერჩევით.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 7+7 extended, 64/82 mm" },
      { label: "Turbine Wheel", value: "Inconel 10-blade, 68 mm" },
      { label: "Housing", value: "Twin-scroll, V-band" },
      { label: "Max Boost", value: "38 PSI" },
      { label: "Crank HP Potential", value: "820 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "Dual ceramic ball" },
      { label: "Warranty", value: "Race use — 6 months" },
    ],
  },
  {
    id: "oem180",
    name: "OEM-180 STANDARD",
    code: "OEM-180",
    category: "OEM REPLACEMENT",
    vehicles: ["TOYOTA", "MERCEDES"],
    fitments: [
      {
        make: "Toyota",
        model: "Hilux 2.4D (2GD-FTV)",
        years: "2015–2024",
        engine: "2.4 D-4D",
      },
      {
        make: "Mercedes",
        model: "Sprinter 2.1d (OM651)",
        years: "2013–2020",
        engine: "2.1 CDI",
      },
    ],
    boost: 16,
    hp: 240,
    price: 760,
    img: mainImageFor("OEM REPLACEMENT"),
    gallery: galleryFor("OEM REPLACEMENT"),
    stock: "IN STOCK",
    tagline: "Reliable OE-spec replacement for daily duty.",
    taglineKa: "საიმედო OE-სპეც ჩანაცვლება ყოველდღიური სამსახურისთვის.",
    description:
      "Direct OE replacement with new actuator. Designed for long-haul reliability in commercial and passenger duty.",
    descriptionKa:
      "პირდაპირი OE ჩანაცვლება ახალი აქტუატორით. შექმნილია გრძელვადიანი საიმედოობისთვის კომერციულ და სამგზავრო ექსპლუატაციაში.",
    specs: [
      { label: "Compressor Wheel", value: "OE 6+6, 38/52 mm" },
      { label: "Turbine Wheel", value: "OE 9-blade, 47 mm" },
      { label: "Housing", value: "Variable geometry" },
      { label: "Max Boost", value: "16 PSI" },
      { label: "Crank HP Potential", value: "240 HP" },
      { label: "Cooling", value: "Oil" },
      { label: "Bearing System", value: "Journal" },
      { label: "Warranty", value: "24 months" },
    ],
  },
  {
    id: "bx500",
    name: "BX-500 STREET BILLET",
    code: "BX-500",
    category: "BILLET",
    vehicles: ["BMW", "MERCEDES", "AUDI"],
    fitments: [
      {
        make: "BMW",
        model: "M340i / Z4 M40i (B58)",
        years: "2019–2024",
        engine: "3.0L I6 TT",
      },
      {
        make: "Mercedes",
        model: "AMG C43 (M276)",
        years: "2016–2022",
        engine: "3.0L V6 TT",
      },
      {
        make: "Audi",
        model: "S4/S5 B9 (EA839)",
        years: "2017–2024",
        engine: "3.0 TFSI",
      },
    ],
    boost: 32,
    hp: 600,
    price: 2890,
    img: mainImageFor("BILLET"),
    gallery: galleryFor("BILLET"),
    stock: "IN STOCK",
    tagline: "Daily-driver billet upgrade with serious headroom.",
    taglineKa: "ყოველდღიური სამართავად ბილეტის განახლება სერიოზული პოტენციალით.",
    description:
      "Street-tuned billet wheel set with OE housing compatibility. Targets 500–600 HP with supporting mods.",
    descriptionKa:
      "ქუჩისთვის მორგებული ბილეტის ბორბლების ნაკრები, თავსებადი OE კორპუსთან. მიზანია 500–600 ცხენის ძალა დამხმარე მოდიფიკაციებით.",
    specs: [
      { label: "Compressor Wheel", value: "Billet 7+0 extended, 56/72 mm" },
      { label: "Turbine Wheel", value: "Inconel 10-blade, 58 mm" },
      { label: "Housing", value: "OE casting, machined" },
      { label: "Max Boost", value: "32 PSI" },
      { label: "Crank HP Potential", value: "600 HP" },
      { label: "Cooling", value: "Water + oil" },
      { label: "Bearing System", value: "360° journal" },
      { label: "Warranty", value: "18 months" },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
