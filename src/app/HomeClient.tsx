"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton } from "@/components/Booking";
import { PRODUCTS } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";

const heroImg = "/images/showroom-interior-wide.jpeg";
const workshop = "/images/showroom-counter-wall.jpeg";
const featured = PRODUCTS.slice(0, 3);

export function HomeClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <Inventory />
      <Journey />
      <BookingCTA />
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO (showroom-style full-bleed) ---------------- */
function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative border-b border-border">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImg}
          alt="GMS Turbo Georgia flagship showroom in Tbilisi"
          width={1600}
          height={900}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-12">
          <p className="mb-6 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("home.heroKicker")}
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.86] tracking-tight">
            {t("home.heroLine1")} {t("home.heroLine2")}
            <br />
            <span className="text-turbo">{t("home.heroLine3a")}</span>{" "}
            {t("home.heroLine3b")}
          </h1>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
            >
              {t("home.heroCtaCatalog")}
            </Link>
            <BookCallButton variant="outline" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:ml-4">
              {t("home.heroBlurb")}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        <Fact k={t("home.factEst")} v={t("home.factEstVal")} />
        <Fact k={t("home.factRebuilt")} v={t("home.factRebuiltVal")} />
        <Fact k={t("home.factTurnaround")} v={t("home.factTurnaroundVal")} />
        <Fact k={t("home.factWarranty")} v={t("home.factWarrantyVal")} />
      </div>
    </section>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-background p-5">
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {k}
      </p>
      <p className="mt-2 font-display text-lg tracking-wide">{v}</p>
    </div>
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
        <Link
          href="/catalog"
          className="mt-8 inline-flex font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:hidden"
        >
          {t("home.inventoryViewAll")}
        </Link>
      </div>
    </section>
  );
}

/* ---------------- TECHNICAL JOURNEY (working steps) ---------------- */
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
    <section id="process" className="relative border-b border-border">
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
            <Link
              href="/contact"
              className="mt-6 inline-flex w-fit items-center gap-3 font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember"
            >
              {t("home.scheduleVisit")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BOOKING CTA ---------------- */
function BookingCTA() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="border-b border-border bg-graphite">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("home.bookKicker")}
            </p>
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
              {t("home.bookTitle1")}
              <br />
              <span className="text-turbo">{t("home.bookTitle2")}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              {t("home.bookBlurb")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookCallButton />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-border px-7 py-4 font-heading text-sm tracking-[0.2em] text-foreground transition-colors hover:border-turbo hover:text-turbo"
              >
                {t("nav.contact")}
              </Link>
            </div>
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
