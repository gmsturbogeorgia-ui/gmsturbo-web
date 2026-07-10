"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";

const servicesImg = "/images/services.svg";
const workshop = "/images/workshop.svg";
const precision = "/images/precision.svg";

const SERVICES = [
  {
    n: "01",
    name: "DIAGNOSTICS & FAULT SCAN",
    nameKa: "დიაგნოსტიკა და ხარვეზების სკანირება",
    desc: "Computerized fault scan, boost & pressure analysis, oil-feed inspection and full failure-mode report.",
    descKa:
      "კომპიუტერული ხარვეზების სკანირება, ბუსტისა და წნევის ანალიზი, ზეთის მიწოდების შემოწმება და გაუმართაობის სრული ანგარიში.",
    price: "from 120 GEL",
    priceKa: "120 ლარიდან",
    eta: "60 MIN",
  },
  {
    n: "02",
    name: "OEM REBUILD",
    nameKa: "OEM აღდგენა",
    desc: "Full disassembly, ultrasonic cleaning, machining, OEM-spec core internals, VSR balancing and pressure test.",
    descKa:
      "სრული დაშლა, ულტრაბგერითი გაწმენდა, დამუშავება, OEM-სპეც შიდა ნაწილები, VSR დაბალანსება და წნევის ტესტი.",
    price: "from 650 GEL",
    priceKa: "650 ლარიდან",
    eta: "24 H",
  },
  {
    n: "03",
    name: "HYBRID UPGRADE",
    nameKa: "ჰიბრიდული განახლება",
    desc: "Billet compressor wheels, ported housings, upgraded thrust bearings — engineered for daily reliability.",
    descKa:
      "ბილეტის კომპრესორის ბორბლები, დამუშავებული კორპუსები, განახლებული საყრდენი საკისრები — შექმნილი ყოველდღიური საიმედოობისთვის.",
    price: "from 1,450 GEL",
    priceKa: "1,450 ლარიდან",
    eta: "3 DAYS",
  },
  {
    n: "04",
    name: "COMPETITION BUILD",
    nameKa: "სპორტული პროექტი",
    desc: "Bespoke billet CHRA, Inconel turbines, ceramic-coated housings and dyno-correlated boost mapping.",
    descKa:
      "ინდივიდუალური ბილეტის CHRA, Inconel ტურბინები, კერამიკული საფარის კორპუსები და დინოზე შესწავლილი ბუსტის რუკირება.",
    price: "from 3,800 GEL",
    priceKa: "3,800 ლარიდან",
    eta: "1–2 WEEKS",
  },
  {
    n: "05",
    name: "VSR BALANCING",
    nameKa: "VSR დაბალანსება",
    desc: "High-speed core balancing to sub-micron tolerance with documented pass certificate.",
    descKa:
      "მაღალსიჩქარიანი ბირთვის დაბალანსება მიკრონის სიზუსტით, დოკუმენტირებული სერტიფიკატით.",
    price: "from 220 GEL",
    priceKa: "220 ლარიდან",
    eta: "45 MIN",
  },
  {
    n: "06",
    name: "ACTUATOR & WASTEGATE",
    nameKa: "აქტუატორი და ვეისთგეითი",
    desc: "Electronic and pneumatic actuator calibration, wastegate preload setup and crack pressure verification.",
    descKa:
      "ელექტრონული და პნევმატური აქტუატორის კალიბრაცია, ვეისთგეითის წინასწარი დატვირთვის მორგება და გახსნის წნევის შემოწმება.",
    price: "from 180 GEL",
    priceKa: "180 ლარიდან",
    eta: "90 MIN",
  },
];

export function ServicesClient() {
  const { t, lang } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-turbo" />
                <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                  {t("services.kicker")}
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-tight">
                {t("services.title1")}
                <br />
                <span className="text-turbo">{t("services.title2")}</span>{" "}
                {t("services.title2b")}
                <br />
                {t("services.title3")}
              </h1>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("services.blurb")}
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px bg-border">
              <Metric n="1,400+" l={t("services.unitsRebuilt")} />
              <Metric n="0.001" l={t("services.mmTolerance")} />
              <Metric n="24H" l={t("services.avgTurnaround")} />
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden bg-carbon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={servicesImg}
              alt="VSR balancing in workshop"
              width={1600}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-border bg-background/90 px-5 py-3 font-mono text-[10px] tracking-widest text-muted-foreground backdrop-blur">
              <span>BENCH / VSR-04</span>
              <span>STATUS / LIVE</span>
              <span>TBILISI</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("services.catalogKicker")}
              </p>
              <h2 className="font-display text-5xl tracking-wide md:text-6xl">
                {t("services.matrixTitle")}
              </h2>
            </div>
            <Link
              href="/#contact"
              className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
            >
              {t("services.requestQuote")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.n}
                className="group relative bg-background p-7 transition-colors hover:bg-carbon"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span className="font-display text-3xl text-turbo">{s.n}</span>
                  <span className="border border-border px-2 py-1 font-mono text-[10px] tracking-widest text-muted-foreground">
                    {t("services.eta")} {s.eta}
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-lg tracking-[0.12em]">
                  {lang === "KA" ? s.nameKa : s.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {lang === "KA" ? s.descKa : s.desc}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                    {t("services.starting")}
                  </span>
                  <span className="font-display text-xl text-foreground">
                    {lang === "KA" ? s.priceKa : s.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-graphite">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.3fr] lg:py-28">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("services.methodKicker")}
            </p>
            <h2 className="font-display text-5xl leading-[0.9] md:text-6xl">
              {t("services.method1")}
              <br />
              <span className="text-turbo">{t("services.method2")}</span>
              <br />
              {t("services.method3")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("services.methodBlurb")}
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex w-fit items-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
            >
              {t("services.scheduleVisit")}
            </Link>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={precision}
              alt="Precision rebuild"
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
            <Pillar t={t("services.warranty1t")} d={t("services.warranty1d")} />
            <Pillar t={t("services.warranty2t")} d={t("services.warranty2d")} />
            <Pillar t={t("services.warranty3t")} d={t("services.warranty3d")} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Metric({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-background p-5">
      <p className="font-display text-3xl">{n}</p>
      <p className="mt-2 font-mono text-[9px] tracking-widest text-muted-foreground">
        {l}
      </p>
    </div>
  );
}

function Pillar({ t, d }: { t: string; d: string }) {
  return (
    <div className="bg-background p-8">
      <h3 className="mb-4 font-heading text-base tracking-[0.18em] text-turbo">
        {t}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
    </div>
  );
}
