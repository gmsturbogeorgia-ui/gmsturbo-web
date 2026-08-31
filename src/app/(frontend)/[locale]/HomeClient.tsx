"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton, BookCallPill } from "@/components/Booking";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { useEffect, useRef, useState } from "react";

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
        <Catalog catalog={home.inventory} featured={featured} />
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
   Cinematic full-bleed footage with the copy sitting on it — that's the
   part worth borrowing.

   The composition is deliberately ours, not the reference's: copy is
   anchored to the BOTTOM-left and the scrim runs bottom-up rather than
   left-across, so the image is at its most open where the showroom's neon
   and walnut actually are, and the hero dissolves into the stats band below
   instead of stopping at a hard edge.

   No slider: one looping shot, held. A single strong image with room to
   breathe says more than four rotating past.
   -------------------------------------------------------------------------- */
function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    // `autoPlay` is on the element so the loop starts without waiting for
    // hydration; this only takes it back off for people who asked for reduced
    // motion, which leaves them the first frame. CSS can't pause a video.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
    }

    // The fade-in is driven from here rather than an `onCanPlay` prop because
    // the <video> is server-rendered: with `preload="auto"` the event can fire
    // before React hydrates and attaches that handler, which would leave the
    // hero permanently blank. Checking readyState first covers that race.
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    // `error` too, so a video that never loads doesn't hold the fade at 0 —
    // it reveals the (empty, dark) element and the copy keeps its backdrop.
    el.addEventListener("loadeddata", onReady, { once: true });
    el.addEventListener("error", onReady, { once: true });
    return () => {
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("error", onReady);
    };
  }, []);

  return (
    <section
      // -mt-18 pulls the section up under the sticky 4.5rem header so the
      // video runs behind it; the content adds the height back as
      // padding so nothing sits underneath the nav.
      className="relative -mt-18 flex h-[70dvh] min-h-[620px] w-full items-center overflow-hidden bg-base"
    >
      {/* Looping turbo animation, no poster: a still swapping for the video
          mid-load reads as a glitch. The section's own dark background holds
          the frame instead, and the video fades in over it once its first
          frame is decoded. */}
      <video
        ref={video}
        src="/video/hero-turbo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="A full view of an automotive turbocharger, housing and all"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
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
        <p className="rise inline-flex items-center rounded-full bg-ink/10 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur-md">
          {hero.kicker}
        </p>

        {/* Display type wants tighter tracking and leading than the base h1
            rule, which is tuned for 40px section headings, not 76px. */}
        <h1
          className="rise mt-6 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold leading-[1.03] tracking-[-0.035em]"
          style={{ animationDelay: "60ms" }}
        >
          {hero.line1} {hero.line2}{" "}
          <span className="text-turbo [text-shadow:0_0_48px_rgba(255,74,43,0.45)]">
            {hero.line3a} {hero.line3b}
          </span>
        </h1>

        <p
          className="rise mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft"
          style={{ animationDelay: "120ms" }}
        >
          {hero.blurb}
        </p>

        <div
          className="rise mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <ButtonLink href="/catalog">{hero.ctaLabel}</ButtonLink>
          <BookCallPill />
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
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
      <FlameEdge flip />
    </section>
  );
}

/* ------------------------------------------------------------- CATALOG ---- */
function Catalog({
  catalog,
  featured,
}: {
  catalog: HomeContent["inventory"];
  featured: Product[];
}) {
  const { t } = useLanguage();
  return (
    <section id="catalog" className="shell py-20 md:py-28">
      <SectionHead
        eyebrow={t("nav.catalog")}
        title={catalog.title}
        lead={catalog.lead}
        action={<TextLink href="/catalog">{catalog.viewAllLabel}</TextLink>}
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
  return (
    <section id="process" className="relative overflow-hidden bg-graphite">
      {/* Skid running along the base of the band. Sits low so it lands in the
          section's bottom padding rather than behind the step copy, and at
          14% — quieter than the standalone divider, because here it's
          texture under content, not a moment of its own. */}
      <TireTrack className="absolute inset-x-0 bottom-0 h-16 opacity-[0.14] md:h-24" />

      <div className="shell relative py-20 md:py-28">
        <SectionHead
          eyebrow={journey.kicker}
          title={journey.title}
          lead={journey.lead}
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
                {s.title}
              </h3>
              <p className="mt-2 max-w-xs text-[0.9375rem] text-ink-soft">
                {s.desc}
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
          <p className="eyebrow">{workshop.tag}</p>
          <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)]">
            {workshop.title}
          </h2>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
            {workshop.blurb}
          </p>
          <div className="mt-8">
            <TextLink href="/contact">{workshop.scheduleVisitLabel}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- BOOK CTA ---- */
function BookingCTA({ booking }: { booking: HomeContent["booking"] }) {
  const { t } = useLanguage();
  return (
    <section id="contact" className="shell">
      <div className="rounded-[2rem] bg-turbo-wash px-6 py-16 md:px-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-turbo">{booking.kicker}</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
              {booking.title1}{" "}
              <span className="text-turbo">{booking.title2}</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              {booking.blurb}
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
                  href="tel:+995551244222"
                  className="tnum font-display text-2xl font-semibold text-ink transition-colors hover:text-turbo"
                >
                  +995 551 24 42 22
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
