"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { PRODUCTS } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";

const heroTurbo = "/images/hero-turbo.svg";
const workshop = "/images/workshop.svg";
const precision = "/images/precision.svg";
const featured = PRODUCTS.slice(0, 3);

export function HomeClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Inventory />
      <Precision />
      <Journey />
      <UpgradeCTA />
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative border-b border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-turbo" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("home.heroKicker")}
              </span>
            </div>
            <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.88] tracking-tight">
              {t("home.heroLine1")}
              <br />
              {t("home.heroLine2")}
              <br />
              <span className="text-turbo">{t("home.heroLine3a")}</span>{" "}
              {t("home.heroLine3b")}
            </h1>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
            <div className="flex flex-col gap-3">
              <a
                href="#inventory"
                className="inline-flex items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
              >
                {t("home.heroCta1")}
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border border-border px-7 py-4 font-heading text-sm tracking-[0.2em] text-foreground transition-colors hover:border-turbo hover:text-turbo"
              >
                {t("home.heroCta2")}
              </a>
            </div>
            <p className="max-w-xs justify-self-start text-sm leading-relaxed text-muted-foreground sm:justify-self-end sm:text-right">
              {t("home.heroBlurb")}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 left-0 z-10 flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground">
            <span className="text-turbo">●</span> {t("home.heroLiveTag")}
          </div>
          <div className="relative h-full min-h-[420px] overflow-hidden bg-carbon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroTurbo}
              alt="Premium turbocharger"
              width={1280}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-border bg-background/90 px-5 py-3 font-mono text-[10px] tracking-widest text-muted-foreground backdrop-blur">
              <span>MODEL / GMS-T450</span>
              <span>BOOST / 32 PSI</span>
              <span>HP+ / 680</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- INVENTORY ---------------- */
function Inventory() {
  const { t, lang } = useLanguage();
  return (
    <section id="inventory" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 01
            </p>
            <h2 className="font-display text-5xl tracking-wide md:text-6xl">
              {t("home.inventoryTitle")}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
          >
            {t("home.inventoryViewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {featured.map((p, i) => (
            <Link
              key={p.id}
              href={`/catalog/${p.id}`}
              className="group relative block bg-background transition-colors hover:bg-carbon"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-turbo px-2.5 py-1 font-mono text-[10px] tracking-widest text-white">
                  0{i + 1}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border px-5 py-5">
                <div>
                  <p className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground">
                    {stockLabel(p.stock, lang)}
                  </p>
                  <h3 className="font-display text-xl tracking-wide">
                    {p.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-turbo">
                    {p.price.toLocaleString()} GEL
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRECISION ---------------- */
function Precision() {
  const { t } = useLanguage();
  return (
    <section className="border-b border-border bg-graphite">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-28">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("home.precisionKicker")}
            </p>
            <h2 className="font-display text-5xl leading-[0.9] md:text-7xl">
              {t("home.precisionTitle1")}
              <br />
              <span className="text-turbo">{t("home.precisionTitle2")}</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("home.precisionBlurb")}
            </p>
          </div>

          <blockquote className="border-l-2 border-turbo pl-5">
            <p className="text-sm italic leading-relaxed text-foreground/90">
              {t("home.precisionQuote")}
            </p>
            <footer className="mt-3 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("home.precisionQuoteAuthor")}
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border">
          <Stat number="0.001" unit="MM" label={t("home.statBalance")} />
          <Stat number="24H" unit="" label={t("home.statTurnaround")} />
          <Stat number="1,400+" unit="" label={t("home.statRebuilt")} />
          <Stat number="100%" unit="" label={t("home.statTested")} />
          <div className="col-span-2 relative aspect-[16/8] overflow-hidden bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={precision}
              alt="Precision rebuilding process"
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  number,
  unit,
  label,
}: {
  number: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="bg-graphite p-6">
      <p className="font-display text-4xl text-foreground md:text-5xl">
        {number}
        {unit && (
          <span className="ml-1 text-base text-muted-foreground">{unit}</span>
        )}
      </p>
      <p className="mt-3 font-mono text-[10px] tracking-widest text-muted-foreground">
        {label.toUpperCase()}
      </p>
    </div>
  );
}

/* ---------------- TECHNICAL JOURNEY ---------------- */
const steps = [
  {
    n: "01",
    title: "DIAGNOSTICS",
    titleKa: "დიაგნოსტიკა",
    desc: "Computerized fault scan, boost & pressure analysis.",
    descKa: "კომპიუტერული ხარვეზების სკანირება, დატენვისა და წნევის ანალიზი.",
  },
  {
    n: "02",
    title: "INSPECTION",
    titleKa: "ინსპექცია",
    desc: "Disassembly. Wear mapping. Compressor & turbine eval.",
    descKa: "დაშლა. ცვეთის რუკირება. კომპრესორისა და ტურბინის შეფასება.",
  },
  {
    n: "03",
    title: "REPAIR",
    titleKa: "შეკეთება",
    desc: "Machining, shaft balancing, seal & bearing replacement.",
    descKa:
      "დამუშავება, ლილვის დაბალანსება, საცობებისა და საკისრების ჩანაცვლება.",
  },
  {
    n: "04",
    title: "REBUILD",
    titleKa: "აღდგენა",
    desc: "OEM-spec reassembly with new core internals.",
    descKa: "OEM-სპეც აწყობა ახალი შიდა ნაწილებით.",
  },
  {
    n: "05",
    title: "TESTING",
    titleKa: "ტესტირება",
    desc: "VSR bench balancing and live pressure verification.",
    descKa: "VSR სტენდზე დაბალანსება და წნევის რეალურ დროში შემოწმება.",
  },
  {
    n: "06",
    title: "DELIVERY",
    titleKa: "მიწოდება",
    desc: "Documented, sealed, and shipped Caucasus-wide.",
    descKa: "დოკუმენტირებული, დალუქული და გაგზავნილი მთელ კავკასიაში.",
  },
];

function Journey() {
  const { t, lang } = useLanguage();
  return (
    <section id="services" className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="mb-14">
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("home.journeyKicker")}
          </p>
          <h2 className="font-display text-5xl tracking-wide md:text-6xl">
            {t("home.journeyTitle")}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[28px] hidden h-px bg-border md:block" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="mb-5 flex h-14 items-start">
                  <span
                    className={`relative z-10 flex h-14 w-14 items-center justify-center font-display text-xl ${
                      i === 0
                        ? "bg-turbo text-white"
                        : "border border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="mb-2 font-heading text-sm tracking-[0.15em]">
                  {lang === "KA" ? s.titleKa : s.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {lang === "KA" ? s.descKa : s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-px bg-border lg:grid-cols-[1.6fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden bg-graphite lg:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={workshop}
              alt="GMS Turbo workshop"
              loading="lazy"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between bg-graphite p-8 lg:p-10">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("home.workshopTag")}
              </p>
              <h3 className="font-display text-3xl leading-tight md:text-4xl">
                {t("home.workshopTitle")}
              </h3>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {t("home.workshopBlurb")}
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex w-fit items-center gap-3 font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember"
            >
              {t("home.scheduleVisit")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- UPGRADE CTA ---------------- */
function UpgradeCTA() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 04
            </p>
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
              {t("home.ctaTitle1")}
              <br />
              <span className="text-turbo">{t("home.ctaTitle2")}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              {t("home.ctaBlurb")}
            </p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("home.callDirect")}
            </p>
            <p className="font-display text-3xl tracking-wide">
              +995 32 2 99 00 00
            </p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("home.workshop")}
            </p>
            <p className="font-display text-3xl tracking-wide">
              {t("home.location")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
