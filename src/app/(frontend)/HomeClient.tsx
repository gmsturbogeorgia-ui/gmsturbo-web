"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton } from "@/components/Booking";
import { ProductCard, ProductGrid } from "@/components/ProductCard";
import {
  ButtonLink,
  FlameEdge,
  SectionHead,
  Stat,
  TextLink,
  TireTrack,
} from "@/components/Primitives";
import type { Product } from "@/lib/products";
import type { HomeContent } from "@/lib/getHome";
import { useLanguage } from "@/lib/i18n/context";

export function HomeClient({
  home,
  featured,
}: {
  home: HomeContent;
  featured: Product[];
}) {
  return (
    <>
      <SiteHeader overlay />
      <main>
        <Hero hero={home.hero} />
        <TrustStrip stats={home.stats} />
        <Inventory inventory={home.inventory} featured={featured} />
        <Process journey={home.journey} />
        <Workshop workshop={home.workshop} />
        {/* Standalone skid as the lead-in to the booking block. Louder than
            the one inside Process, since here it is the moment. */}
        <TireTrack className="my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />
        <BookingCTA booking={home.booking} />
      </main>
      <SiteFooter />
    </>
  );
}

/* ---------------------------------------------------------------- HERO ----
   Cinematic full-bleed photograph with the copy sitting on it — that's the
   part worth borrowing.

   The composition is deliberately ours, not the reference's: copy is
   anchored to the BOTTOM-left and the scrim runs bottom-up rather than
   left-across, so the image is at its most open where the showroom's neon
   and walnut actually are, and the hero dissolves into the stats band below
   instead of stopping at a hard edge.

   No slider: one photograph, held. A single strong image with room to
   breathe says more than four rotating past.
   -------------------------------------------------------------------------- */
function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const { lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);

  return (
    <section
      // -mt-18 pulls the section up under the sticky 4.5rem header so the
      // photograph runs behind it; the content adds the height back as
      // padding so nothing sits underneath the nav.
      className="relative -mt-18 flex h-[92svh] min-h-[620px] w-full items-center overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.image}
        alt="The GMS Turbo Georgia showroom floor in Tbilisi"
        width={1600}
        height={1000}
        fetchPriority="high"
        className="hero-zoom absolute inset-0 h-full w-full object-cover"
      />

      {/* Scrim, bottom-weighted. `via-base/45` at the midpoint keeps the copy
          legible over the bright neon sign without flattening the ceiling. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-base via-base/45 to-base/35"
      />
      {/* A little extra hold under the copy column only. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-base/70 via-transparent to-transparent"
      />

      {/* pt-18 is inside the centred box on purpose: it offsets the overlaid
          header's 4.5rem, so the copy lands optically centred in the visible
          area rather than in the raw section box. */}
      <div className="shell relative w-full pt-18">
        <p className="rise inline-flex items-center gap-2.5 rounded-full bg-ink/10 py-1.5 pl-2.5 pr-4 text-xs font-semibold text-ink backdrop-blur-md">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-turbo opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-turbo" />
          </span>
          {pick(hero.kicker, hero.kickerKa)}
        </p>

        {/* Display type wants tighter tracking and leading than the base h1
            rule, which is tuned for 40px section headings, not 76px. */}
        <h1
          className="rise mt-6 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ animationDelay: "60ms" }}
        >
          {pick(hero.line1, hero.line1Ka)} {pick(hero.line2, hero.line2Ka)}{" "}
          <span className="text-turbo [text-shadow:0_0_48px_rgba(255,74,43,0.45)]">
            {pick(hero.line3a, hero.line3aKa)}{" "}
            {pick(hero.line3b, hero.line3bKa)}
          </span>
        </h1>

        <p
          className="rise mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft"
          style={{ animationDelay: "120ms" }}
        >
          {pick(hero.blurb, hero.blurbKa)}
        </p>

        <div
          className="rise mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <ButtonLink href="/catalog">
            {pick(hero.ctaLabel, hero.ctaLabelKa)}
          </ButtonLink>
          <BookCallButton variant="secondary" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ TRUST BAR ---
   Four figures on a graphite band. The old version was a four-cell grid
   held together by 1px gaps showing the border colour through — a lot of
   scaffolding for four short facts.
   -------------------------------------------------------------------------- */
function TrustStrip({ stats }: { stats: HomeContent["stats"] }) {
  const { lang } = useLanguage();
  return (
    // Flames on both edges, so the band reads as a burning slab rather than
    // a rectangle: rising into the hero above, falling toward the catalog
    // below. Each edge is a separate element outside the graphite fill —
    // that's what lets the flame silhouettes sit on the page background.
    <section>
      <FlameEdge />
      <div className="bg-graphite">
        <div className="shell grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:py-12">
          {stats.map((s) => (
            <Stat
              key={s.label}
              value={lang === "KA" ? s.valueKa : s.value}
              label={lang === "KA" ? s.labelKa : s.label}
            />
          ))}
        </div>
      </div>
      <FlameEdge flip />
    </section>
  );
}

/* ----------------------------------------------------------- INVENTORY ---- */
function Inventory({
  inventory,
  featured,
}: {
  inventory: HomeContent["inventory"];
  featured: Product[];
}) {
  const { t, lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);
  return (
    <section id="inventory" className="shell py-20 md:py-28">
      <SectionHead
        eyebrow={t("nav.inventory")}
        title={pick(inventory.title, inventory.titleKa)}
        lead={pick(inventory.lead, inventory.leadKa)}
        action={
          <TextLink href="/catalog">
            {pick(inventory.viewAllLabel, inventory.viewAllLabelKa)}
          </TextLink>
        }
      />
      <ProductGrid className="mt-12">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductGrid>
    </section>
  );
}

/* -------------------------------------------------------------- PROCESS ---- */
function Process({ journey }: { journey: HomeContent["journey"] }) {
  const { lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);
  return (
    <section id="process" className="relative overflow-hidden bg-graphite">
      {/* Skid running along the base of the band. Sits low so it lands in the
          section's bottom padding rather than behind the step copy, and at
          14% — quieter than the standalone divider, because here it's
          texture under content, not a moment of its own. */}
      <TireTrack className="absolute inset-x-0 bottom-0 h-16 opacity-[0.14] md:h-24" />

      <div className="shell relative py-20 md:py-28">
        <SectionHead
          eyebrow={pick(journey.kicker, journey.kickerKa)}
          title={pick(journey.title, journey.titleKa)}
          lead={pick(journey.lead, journey.leadKa)}
        />

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {journey.steps.map((s) => (
            <li key={s.n} className="group">
              {/* The oversized numeral does the counting — no badge square,
                  no connector rail, no coloured chip. */}
              <span
                aria-hidden
                className="tnum block font-display text-5xl font-bold leading-none text-turbo/25 transition-colors duration-500 group-hover:text-turbo/70"
              >
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {pick(s.title, s.titleKa)}
              </h3>
              <p className="mt-2 max-w-xs text-[0.9375rem] text-ink-soft">
                {pick(s.desc, s.descKa)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- WORKSHOP ---- */
function Workshop({ workshop }: { workshop: HomeContent["workshop"] }) {
  const { lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);
  return (
    <section className="shell py-20 md:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div className="overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={workshop.image}
            alt="The GMS Turbo showroom floor in Tbilisi"
            loading="lazy"
            width={1600}
            height={900}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div>
          <p className="eyebrow">{pick(workshop.tag, workshop.tagKa)}</p>
          <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)]">
            {pick(workshop.title, workshop.titleKa)}
          </h2>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
            {pick(workshop.blurb, workshop.blurbKa)}
          </p>
          <div className="mt-8">
            <TextLink href="/contact">
              {pick(workshop.scheduleVisitLabel, workshop.scheduleVisitLabelKa)}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- BOOK CTA ---- */
function BookingCTA({ booking }: { booking: HomeContent["booking"] }) {
  const { t, lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);
  return (
    <section id="contact" className="shell">
      <div className="rounded-[2rem] bg-turbo-wash px-6 py-16 md:px-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-turbo">
              {pick(booking.kicker, booking.kickerKa)}
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
              {pick(booking.title1, booking.title1Ka)}{" "}
              <span className="text-turbo">
                {pick(booking.title2, booking.title2Ka)}
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              {pick(booking.blurb, booking.blurbKa)}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <BookCallButton />
              <ButtonLink href="/contact" variant="secondary">
                {t("nav.contact")}
              </ButtonLink>
            </div>
          </div>

          <dl className="flex flex-col justify-center gap-8">
            <div>
              <dt className="text-sm text-ink-mute">{t("home.callDirect")}</dt>
              <dd className="mt-1.5">
                <a
                  href="tel:+995322990000"
                  className="tnum font-display text-2xl font-semibold text-ink transition-colors hover:text-turbo"
                >
                  +995 32 2 99 00 00
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-mute">{t("home.workshop")}</dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-ink">
                {t("home.location")}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-mute">
                {t("contact.hoursLabel")}
              </dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-ink">
                {t("contact.hoursVal")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
