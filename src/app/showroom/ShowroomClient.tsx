"use client";

import { PRODUCTS } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { ProductCard, ProductGrid } from "@/components/ProductCard";
import { SectionHead, Stat, TextLink } from "@/components/Primitives";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const heroImg = "/images/showroom-reception-neon.jpeg";
const HIGHLIGHTS = PRODUCTS.slice(0, 4);

// Real photos of the Tbilisi flagship. These appear nowhere else on the
// site, which is what makes this page distinct from the home hero.
const GALLERY_BANNER = "/images/gms-turbo-neon-sign.jpeg";
const GALLERY = [
  { src: "/images/showroom-stock-shelves.jpeg", cap: "Stock wall" },
  { src: "/images/showroom-stock-aisle.jpeg", cap: "The aisle" },
  { src: "/images/showroom-counter-wall.jpeg", cap: "The counter" },
  { src: "/images/products/turbo-parts-display.jpeg", cap: "Display case" },
  { src: "/images/warehouse-stock.jpeg", cap: "Warehouse" },
  { src: "/images/showroom-display-minimal.jpeg", cap: "The plinth" },
];

export function ShowroomClient() {
  const { t } = useLanguage();
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero. Rounded, inset panorama rather than a full-bleed image with
            a gradient scrim faked over the bottom third. */}
        <section className="shell pt-6">
          <p className="eyebrow">{t("showroom.tag")}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold">
            {t("showroom.title1")}{" "}
            <span className="text-turbo">{t("showroom.title2")}</span>
          </h1>

          <div className="mt-10 overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImg}
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
            <Stat
              value={t("showroom.hoursVal")}
              label={t("showroom.hoursLabel")}
            />
            <Stat
              value={t("showroom.saturdayVal")}
              label={t("showroom.saturdayLabel")}
            />
            <Stat
              value={t("showroom.viewingsVal")}
              label={t("showroom.viewingsLabel")}
            />
            <Stat
              value={t("showroom.testFitVal")}
              label={t("showroom.testFitLabel")}
            />
          </div>
        </section>

        {/* The space */}
        <section className="shell grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("showroom.spaceKicker")}</p>
            <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
              {t("showroom.spaceTitle1")}{" "}
              <span className="text-turbo">{t("showroom.spaceTitle2")}</span>
            </h2>
          </div>
          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            <p>{t("showroom.p1")}</p>
            <p>{t("showroom.p2")}</p>
            <div className="pt-3">
              <TextLink href="/contact">{t("showroom.bookViewing")}</TextLink>
            </div>
          </div>
        </section>

        {/* Gallery — a proper mosaic, not six identical cells in a hairline
            grid. The banner spans, the rest alternate weights. */}
        <section className="shell pb-20 md:pb-28">
          <SectionHead
            eyebrow={t("showroom.galleryKicker")}
            title={t("showroom.galleryTitle")}
            lead={t("showroom.galleryLead")}
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
              src={GALLERY_BANNER}
              cap="Tsereteli Ave 114"
              className="col-span-2 aspect-[3/2] sm:aspect-[2/1] lg:col-span-4 lg:row-span-2 lg:aspect-auto"
              priority
            />
            {GALLERY.map((g, i) => (
              <GalleryTile
                key={g.src}
                src={g.src}
                cap={g.cap}
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
              eyebrow={t("showroom.displayKicker")}
              title={t("showroom.collectionTitle")}
              action={
                <TextLink href="/catalog">{t("showroom.fullCatalog")}</TextLink>
              }
            />
            <ProductGrid className="mt-10">
              {HIGHLIGHTS.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          </div>
        </section>

        {/* Visit */}
        <section className="shell py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t("showroom.visitKicker")}</p>
              <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
                {t("showroom.visit1")}{" "}
                <span className="text-turbo">{t("showroom.visit2")}</span>
              </h2>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
                {t("showroom.visitBlurb")}
              </p>
            </div>

            <dl className="flex flex-col gap-7">
              <div>
                <dt className="text-sm text-ink-mute">
                  {t("showroom.addressLabel")}
                </dt>
                <dd className="mt-1.5 font-display text-xl font-semibold text-ink">
                  Tsereteli Ave 114, Tbilisi 0119
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">
                  {t("showroom.callLabel")}
                </dt>
                <dd className="mt-1.5">
                  <a
                    href="tel:+995322990000"
                    className="tnum font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
                  >
                    +995 32 2 99 00 00
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">
                  {t("showroom.emailLabel")}
                </dt>
                <dd className="mt-1.5">
                  <a
                    href="mailto:showroom@gmsturbo.ge"
                    className="font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
                  >
                    showroom@gmsturbo.ge
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
