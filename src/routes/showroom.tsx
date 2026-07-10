import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import showroomImg from "@/assets/showroom.svg";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/showroom")({
  head: () => ({
    meta: [
      { title: "Showroom — GMS Turbo Georgia | Tbilisi Flagship" },
      {
        name: "description",
        content:
          "Visit the GMS Turbo Georgia flagship showroom in central Tbilisi. Hand-finished hybrid, billet and competition turbochargers on permanent display.",
      },
      { property: "og:title", content: "Showroom — GMS Turbo Georgia" },
      {
        property: "og:description",
        content: "Flagship turbocharger showroom in central Tbilisi.",
      },
      { property: "og:url", content: "/showroom" },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:title", content: "GMS Turbo Showroom" },
      {
        name: "twitter:description",
        content: "Flagship showroom in central Tbilisi.",
      },
    ],
    links: [{ rel: "canonical", href: "/showroom" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutomotiveBusiness",
          name: "GMS Turbo Georgia — Flagship Showroom",
          image: "/og-image.jpg",
          telephone: "+995 32 2 99 00 00",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Tsereteli Ave 114",
            addressLocality: "Tbilisi",
            postalCode: "0119",
            addressCountry: "GE",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "10:00",
              closes: "20:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "11:00",
              closes: "18:00",
            },
          ],
        }),
      },
    ],
  }),
  component: ShowroomPage,
});

const HIGHLIGHTS = PRODUCTS.slice(0, 6);

function ShowroomPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <img
            src={showroomImg}
            alt="GMS Turbo Georgia flagship showroom in Tbilisi"
            width={1600}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
          <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-turbo" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                / FLAGSHIP — TSERETELI AVE 114, TBILISI
              </span>
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.86] tracking-tight">
              THE
              <br />
              <span className="text-turbo">SHOWROOM</span>
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          <Fact k="HOURS" v="MON–FRI · 10–20" />
          <Fact k="SATURDAY" v="11 — 18" />
          <Fact k="VIEWINGS" v="BY APPOINTMENT" />
          <Fact k="TEST FIT" v="ON-SITE" />
        </div>
      </section>

      {/* Editorial intro */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / 01 — THE SPACE
            </p>
            <h2 className="font-display text-5xl leading-[0.92] md:text-6xl">
              A ROOM FOR THE
              <br />
              <span className="text-turbo">OBSESSED.</span>
            </h2>
          </div>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Inside an unmarked industrial unit on Tsereteli Avenue, the GMS
              flagship is half gallery, half engineering bench. Every
              turbocharger on display is a working unit — dyno-correlated,
              signed and ready to ship.
            </p>
            <p>
              The space was built for the people who walk in already knowing
              what an A/R ratio is. Sit at the bar, watch a CHRA being balanced
              through the glass wall, and spec your next build alongside the
              engineer who'll assemble it.
            </p>
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center gap-3 border border-border px-6 py-4 font-heading text-xs tracking-[0.2em] hover:border-turbo hover:text-turbo"
            >
              BOOK A PRIVATE VIEWING →
            </Link>
          </div>
        </div>
      </section>

      {/* On display */}
      <section className="border-b border-border bg-graphite">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                / 02 — ON DISPLAY
              </p>
              <h2 className="font-display text-5xl tracking-wide md:text-6xl">
                THE COLLECTION
              </h2>
            </div>
            <Link
              to="/catalog"
              className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
            >
              FULL CATALOG →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((p, i) => (
              <Link
                key={p.id}
                to="/catalog/$productId"
                params={{ productId: p.id }}
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
                    PLINTH {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border px-5 py-5">
                  <div>
                    <p className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground">
                      {p.category}
                    </p>
                    <h3 className="font-display text-xl tracking-wide">
                      {p.name}
                    </h3>
                  </div>
                  <p className="font-display text-2xl text-turbo">
                    {p.price.toLocaleString()} GEL
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visit block */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                / 03 — VISIT
              </p>
              <h2 className="font-display text-5xl leading-[0.95] md:text-6xl">
                WALK IN.
                <br />
                <span className="text-turbo">SPEC OUT.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm text-muted-foreground">
                No appointment required for browsing. For private viewings, test
                fits or competition consultations, reserve an hour with our lead
                engineer.
              </p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                ADDRESS
              </p>
              <p className="font-display text-2xl leading-tight tracking-wide">
                TSERETELI AVE 114
                <br />
                TBILISI 0119
              </p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                CALL
              </p>
              <p className="font-display text-2xl tracking-wide">
                +995 32 2 99 00 00
              </p>
              <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground">
                EMAIL
              </p>
              <p className="font-display text-xl tracking-wide">
                SHOWROOM@GMSTURBO.GE
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
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
