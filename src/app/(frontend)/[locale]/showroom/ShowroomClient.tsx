"use client";

import type { Product } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductCard, ProductGrid } from "@/components/ProductCard";
import { SectionHead, Stat, TextLink, TireTrack } from "@/components/Primitives";
import type { ShowroomContent } from "@/lib/getShowroom";
import { cn } from "@/lib/utils";

export function ShowroomClient({
  showroom,
  highlights,
}: {
  showroom: ShowroomContent;
  highlights: Product[];
}) {
  const { hero, stats, gallery, display, visit } = showroom;

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero. Rounded, inset panorama rather than a full-bleed image with
            a gradient scrim faked over the bottom third. */}
        <section className="shell pt-6">
          <p className="eyebrow">{hero.tag}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold">
            {hero.title1}{" "}
            <span className="text-turbo">
              {hero.title2}
            </span>
          </h1>

          <div className="mt-10 overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.image}
              alt="The GMS Turbo Georgia flagship showroom in Tbilisi"
              width={1600}
              height={1024}
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
            />
          </div>
        </section>

        <section className="bg-graphite mt-16">
          <div className="shell grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:py-12">
            {stats.map((s) => (
              <Stat
                key={s.label}
                value={s.value}
                label={s.label}
              />
            ))}
          </div>
        </section>

        {/* Gallery — a proper mosaic, not six identical cells in a hairline
            grid. The banner spans, the rest alternate weights. */}
        <section className="shell py-20 md:py-28">
          <SectionHead
            eyebrow={gallery.kicker}
            title={gallery.title}
            lead={gallery.lead}
          />

          {/* Responsive mosaic.

              Phones get a plain 2-up of squares — a mosaic at 360px just
              produces tiles too small to read. The composition only switches
              on at lg, where fixed 12rem rows let the lead tile span 2×2 and
              the two panoramas bookend it:

                ┌───────── banner (4 wide) ─────────┐
                │  lead   │ 2 │ 3 │
                │  (2×2)  │ 4 │ 5 │
                └───────── closer (4 wide) ─────────┘

              Below lg the aspect ratio sets each tile's height; at lg
              `aspect-auto` hands that job to the grid rows so row-span
              actually works. */}
          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 lg:auto-rows-[12rem] lg:grid-cols-4">
            <GalleryTile
              src={gallery.bannerImage}
              cap={gallery.bannerCaption}
              className="col-span-2 aspect-[3/2] sm:aspect-[2/1] lg:col-span-4 lg:row-span-2 lg:aspect-auto"
              priority
            />
            {gallery.items.map((g, i) => (
              <GalleryTile
                key={g.image}
                src={g.image}
                cap={g.caption}
                className={cn(
                  "aspect-square lg:aspect-auto",
                  i === 0 && "lg:col-span-2 lg:row-span-2",
                  i === 5 && "col-span-2 aspect-[3/2] lg:col-span-4 lg:aspect-auto",
                )}
              />
            ))}
          </div>
        </section>

        {/* On display. Deliberately on the base background — the product
            tiles are graphite panels, so a graphite band would swallow them. */}
        <section>
          <div className="shell py-20 md:py-28">
            <SectionHead
              eyebrow={display.kicker}
              title={display.title}
              action={
                <TextLink href="/catalog">
                  {display.fullCatalogLabel}
                </TextLink>
              }
            />
            <ProductGrid className="mt-10">
              {highlights.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          </div>
        </section>

        <TireTrack className="mx-6 my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />

        {/* Visit */}
        <section className="shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{visit.kicker}</p>
              <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
                {visit.title1}{" "}
                <span className="text-turbo">
                  {visit.title2}
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
                {visit.blurb}
              </p>
            </div>

            <dl className="flex flex-col gap-7">
              <div>
                <dt className="text-sm text-ink-mute">
                  {visit.addressLabel}
                </dt>
                <dd className="mt-1.5 font-display text-xl font-semibold text-ink">
                  {visit.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">
                  {visit.callLabel}
                </dt>
                <dd className="mt-1.5">
                  <a
                    href={`tel:${visit.phone.replace(/\s+/g, "")}`}
                    className="tnum font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
                  >
                    {visit.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">
                  {visit.emailLabel}
                </dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${visit.email}`}
                    className="font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
                  >
                    {visit.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function GalleryTile({
  src,
  cap,
  className,
  priority = false,
}: {
  src: string;
  cap: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        // lg:h-full lets the tile fill a spanned grid area once aspect-auto
        // takes over. The aspect ratio itself is passed in per tile, since
        // it changes across breakpoints.
        "group relative overflow-hidden rounded-2xl bg-graphite lg:h-full",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={cap}
        loading={priority ? "eager" : "lazy"}
        width={1200}
        height={900}
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.04]"
      />
      {/* Caption fades in on hover instead of sitting in a permanent
          translucent slab over the photo. */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-base/85 to-transparent p-3 text-sm font-semibold text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
        {cap}
      </figcaption>
    </figure>
  );
}
