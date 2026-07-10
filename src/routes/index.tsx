import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import heroTurbo from "@/assets/hero-turbo.svg";
import product1 from "@/assets/product-1.svg";
import product2 from "@/assets/product-2.svg";
import product3 from "@/assets/product-3.svg";
import workshop from "@/assets/workshop.svg";
import precision from "@/assets/precision.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GMS Turbo Georgia — Premium Turbocharger Engineering" },
      {
        name: "description",
        content:
          "Premium turbocharger sales, diagnostics, repair and performance solutions. Hybrid, billet and OEM turbos engineered in Tbilisi, Georgia.",
      },
      {
        property: "og:title",
        content: "GMS Turbo Georgia — Give Your Engine A Second Life",
      },
      {
        property: "og:description",
        content:
          "Premium turbocharger engineering. Hybrid, billet and competition-grade turbos.",
      },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-image.jpg" },
      {
        property: "og:image:alt",
        content: "GMS Turbo Georgia — chrome turbocharger",
      },
      { name: "twitter:title", content: "GMS Turbo Georgia" },
      {
        name: "twitter:description",
        content: "Premium turbocharger engineering in Tbilisi, Georgia.",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "GMS Turbo Georgia",
          url: "/",
          inLanguage: ["ka-GE", "en-US"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
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
  return (
    <section className="relative border-b border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-turbo" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                HIGH PERFORMANCE ENGINEERING / EST. 2014
              </span>
            </div>
            <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.88] tracking-tight">
              GIVE YOUR
              <br />
              ENGINE A
              <br />
              <span className="text-turbo">SECOND</span> LIFE
            </h1>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
            <div className="flex flex-col gap-3">
              <a
                href="#inventory"
                className="inline-flex items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
              >
                VIEW CATALOG
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border border-border px-7 py-4 font-heading text-sm tracking-[0.2em] text-foreground transition-colors hover:border-turbo hover:text-turbo"
              >
                OUR SERVICES
              </a>
            </div>
            <p className="max-w-xs justify-self-start text-sm leading-relaxed text-muted-foreground sm:justify-self-end sm:text-right">
              Premium turbocharger sales, diagnostics, repair and performance
              solutions engineered for the most demanding builds.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 left-0 z-10 flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground">
            <span className="text-turbo">●</span> LIVE FROM WORKSHOP / TBILISI
          </div>
          <div className="relative h-full min-h-[420px] overflow-hidden bg-carbon">
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
const products = [
  { name: "GMS T-450 HYBRID", price: "1,850 GEL", img: product1 },
  { name: "ULTRA-BOOST R6X", price: "3,200 GEL", img: product2 },
  { name: "KIT-89 COMPETITION", price: "4,495 GEL", img: product3 },
];

function Inventory() {
  return (
    <section id="inventory" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 01
            </p>
            <h2 className="font-display text-5xl tracking-wide md:text-6xl">
              PREMIUM INVENTORY
            </h2>
          </div>
          <a
            href="#"
            className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
          >
            VIEW ALL PRODUCTS →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {products.map((p, i) => (
            <article
              key={p.name}
              className="group relative bg-background transition-colors hover:bg-carbon"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
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
                    IN STOCK
                  </p>
                  <h3 className="font-display text-xl tracking-wide">
                    {p.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-turbo">{p.price}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRECISION ---------------- */
function Precision() {
  return (
    <section className="border-b border-border bg-graphite">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-28">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 02 — THE CRAFT
            </p>
            <h2 className="font-display text-5xl leading-[0.9] md:text-7xl">
              PRECISION
              <br />
              <span className="text-turbo">REBUILDING</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Every turbo that passes our bench is fully disassembled,
              ultrasonically cleaned, balanced to sub-micron tolerances and
              pressure-tested before delivery. We don't ship anything we
              wouldn't run in our own car.
            </p>
          </div>

          <blockquote className="border-l-2 border-turbo pl-5">
            <p className="text-sm italic leading-relaxed text-foreground/90">
              "The difference between a rebuild and a real rebuild is the
              obsession that goes into it. GMS is the only shop in the Caucasus
              I trust."
            </p>
            <footer className="mt-3 font-mono text-[10px] tracking-widest text-muted-foreground">
              — DAVITI K. / TIME ATTACK DRIVER
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border">
          <Stat number="0.001" unit="MM" label="Balance tolerance" />
          <Stat number="24H" unit="" label="Average turnaround" />
          <Stat number="1,400+" unit="" label="Units rebuilt" />
          <Stat number="100%" unit="" label="Bench tested" />
          <div className="col-span-2 relative aspect-[16/8] overflow-hidden bg-background">
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
    desc: "Computerized fault scan, boost & pressure analysis.",
  },
  {
    n: "02",
    title: "INSPECTION",
    desc: "Disassembly. Wear mapping. Compressor & turbine eval.",
  },
  {
    n: "03",
    title: "REPAIR",
    desc: "Machining, shaft balancing, seal & bearing replacement.",
  },
  {
    n: "04",
    title: "REBUILD",
    desc: "OEM-spec reassembly with new core internals.",
  },
  {
    n: "05",
    title: "TESTING",
    desc: "VSR bench balancing and live pressure verification.",
  },
  {
    n: "06",
    title: "DELIVERY",
    desc: "Documented, sealed, and shipped Caucasus-wide.",
  },
];

function Journey() {
  return (
    <section id="services" className="relative border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="mb-14">
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            / 03 — THE PROCESS
          </p>
          <h2 className="font-display text-5xl tracking-wide md:text-6xl">
            TECHNICAL JOURNEY
          </h2>
        </div>

        <div className="relative">
          {/* horizontal line */}
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
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* workshop hero block */}
        <div className="mt-20 grid grid-cols-1 gap-px bg-border lg:grid-cols-[1.6fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden bg-graphite lg:aspect-auto">
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
                INSIDE THE WORKSHOP
              </p>
              <h3 className="font-display text-3xl leading-tight md:text-4xl">
                A GARAGE BUILT FOR ENGINEERS, NOT SALESMEN.
              </h3>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              CNC machining, VSR balancing rigs, ultrasonic cleaning lines and
              full flow-bench testing — under one roof in central Tbilisi.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex w-fit items-center gap-3 font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember"
            >
              SCHEDULE A VISIT →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- UPGRADE CTA ---------------- */
function UpgradeCTA() {
  return (
    <section id="contact" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 04
            </p>
            <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
              READY TO
              <br />
              <span className="text-turbo">UPGRADE?</span>
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Contact our technical team or visit our shop in central Tbilisi to
              spec your build.
            </p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
              CALL DIRECT
            </p>
            <p className="font-display text-3xl tracking-wide">
              +995 32 2 99 00 00
            </p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
              WORKSHOP
            </p>
            <p className="font-display text-3xl tracking-wide">
              TBILISI, GEORGIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
