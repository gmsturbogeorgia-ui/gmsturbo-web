import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import servicesImg from "@/assets/services.svg";
import workshop from "@/assets/workshop.svg";
import precision from "@/assets/precision.svg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title:
          "Services — GMS Turbo Georgia | Diagnostics, Rebuild, Hybrid Upgrades",
      },
      {
        name: "description",
        content:
          "Full-service turbocharger diagnostics, OEM rebuilds, hybrid upgrades, VSR balancing and bench testing — performed in-house in Tbilisi.",
      },
      { property: "og:title", content: "Services — GMS Turbo Georgia" },
      {
        property: "og:description",
        content:
          "Turbocharger diagnostics, rebuilds, hybrid upgrades and VSR balancing.",
      },
      { property: "og:url", content: "/services" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:title", content: "GMS Turbo Services" },
      {
        name: "twitter:description",
        content: "In-house turbocharger services in Tbilisi.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType:
            "Turbocharger repair, rebuild and performance engineering",
          provider: {
            "@type": "AutomotiveBusiness",
            name: "GMS Turbo Georgia",
          },
          areaServed: { "@type": "Country", name: "Georgia" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "GMS Turbo Services",
            itemListElement: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: s.name,
                description: s.desc,
              },
            })),
          },
        }),
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    n: "01",
    name: "DIAGNOSTICS & FAULT SCAN",
    desc: "Computerized fault scan, boost & pressure analysis, oil-feed inspection and full failure-mode report.",
    price: "from 120 GEL",
    eta: "60 MIN",
  },
  {
    n: "02",
    name: "OEM REBUILD",
    desc: "Full disassembly, ultrasonic cleaning, machining, OEM-spec core internals, VSR balancing and pressure test.",
    price: "from 650 GEL",
    eta: "24 H",
  },
  {
    n: "03",
    name: "HYBRID UPGRADE",
    desc: "Billet compressor wheels, ported housings, upgraded thrust bearings — engineered for daily reliability.",
    price: "from 1,450 GEL",
    eta: "3 DAYS",
  },
  {
    n: "04",
    name: "COMPETITION BUILD",
    desc: "Bespoke billet CHRA, Inconel turbines, ceramic-coated housings and dyno-correlated boost mapping.",
    price: "from 3,800 GEL",
    eta: "1–2 WEEKS",
  },
  {
    n: "05",
    name: "VSR BALANCING",
    desc: "High-speed core balancing to sub-micron tolerance with documented pass certificate.",
    price: "from 220 GEL",
    eta: "45 MIN",
  },
  {
    n: "06",
    name: "ACTUATOR & WASTEGATE",
    desc: "Electronic and pneumatic actuator calibration, wastegate preload setup and crack pressure verification.",
    price: "from 180 GEL",
    eta: "90 MIN",
  },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-turbo" />
                <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                  / SERVICES — IN-HOUSE ENGINEERING
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-tight">
                EVERY TURBO
                <br />
                <span className="text-turbo">EARNS</span> ITS
                <br />
                PRESSURE.
              </h1>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
                Six dedicated workflows — from a 60-minute fault scan to a
                two-week competition build — performed by the same engineers, on
                the same bench, under the same obsession. No outsourcing. No
                shortcuts.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px bg-border">
              <Metric n="1,400+" l="UNITS REBUILT" />
              <Metric n="0.001" l="MM TOLERANCE" />
              <Metric n="24H" l="AVG TURNAROUND" />
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden bg-carbon">
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

      {/* Service grid */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                / 01 — CATALOG
              </p>
              <h2 className="font-display text-5xl tracking-wide md:text-6xl">
                SERVICE MATRIX
              </h2>
            </div>
            <Link
              to="/"
              hash="contact"
              className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
            >
              REQUEST A QUOTE →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.n}
                className="group relative bg-background p-7 transition-colors hover:bg-carbon"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span className="font-display text-3xl text-turbo">
                    {s.n}
                  </span>
                  <span className="border border-border px-2 py-1 font-mono text-[10px] tracking-widest text-muted-foreground">
                    ETA {s.eta}
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-lg tracking-[0.12em]">
                  {s.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                    STARTING
                  </span>
                  <span className="font-display text-xl text-foreground">
                    {s.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-border bg-graphite">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.3fr] lg:py-28">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 02 — METHOD
            </p>
            <h2 className="font-display text-5xl leading-[0.9] md:text-6xl">
              MEASURED.
              <br />
              <span className="text-turbo">MACHINED.</span>
              <br />
              MOUNTED.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Every job follows the same documented protocol. You receive a
              signed inspection report, a balancing certificate and a sealed
              final-test record with every unit.
            </p>
            <Link
              to="/"
              hash="contact"
              className="mt-8 inline-flex w-fit items-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
            >
              SCHEDULE A VISIT
            </Link>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden bg-background">
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

      {/* Warranty / CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
            <Pillar
              t="24 MONTH WARRANTY"
              d="Every rebuilt unit ships with a 24-month workmanship warranty against premature failure."
            />
            <Pillar
              t="DOCUMENTED"
              d="Inspection, balancing and final-test reports archived under your build ID for life."
            />
            <Pillar
              t="CAUCASUS-WIDE"
              d="Sealed delivery to anywhere in Georgia, Armenia and Azerbaijan within 48 hours."
            />
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
