"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";

const showroomImg = "/images/showroom-reception-neon.jpeg";
const HIGHLIGHTS = PRODUCTS.slice(0, 6);

// Real photos of the Tbilisi flagship — the panoramic neon wall leads, then a
// grid of the floor, stock and display case. These images appear nowhere else
// on the site, which is what makes this page distinct from the home hero.
const GALLERY_BANNER = "/images/gms-turbo-neon-sign.jpeg";
const GALLERY = [
  { src: "/images/showroom-stock-shelves.jpeg", cap: "STOCK WALL" },
  { src: "/images/showroom-stock-aisle.jpeg", cap: "THE AISLE" },
  { src: "/images/showroom-counter-wall.jpeg", cap: "THE COUNTER" },
  { src: "/images/products/turbo-parts-display.jpeg", cap: "DISPLAY CASE" },
  { src: "/images/warehouse-stock.jpeg", cap: "WAREHOUSE" },
  { src: "/images/showroom-display-minimal.jpeg", cap: "THE PLINTH" },
];

export function ShowroomClient() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={showroomImg}
            alt="GMS Turbo Georgia flagship showroom in Tbilisi"
            width={1600}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
          <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-6 pb-12">
            <p className="mb-6 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("showroom.tag")}
            </p>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.86] tracking-tight">
              {t("showroom.title1")}
              <br />
              <span className="text-turbo">{t("showroom.title2")}</span>
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          <Fact k={t("showroom.hoursLabel")} v={t("showroom.hoursVal")} />
          <Fact k={t("showroom.saturdayLabel")} v={t("showroom.saturdayVal")} />
          <Fact k={t("showroom.viewingsLabel")} v={t("showroom.viewingsVal")} />
          <Fact k={t("showroom.testFitLabel")} v={t("showroom.testFitVal")} />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("showroom.spaceKicker")}
            </p>
            <h2 className="font-display text-5xl leading-[0.92] md:text-6xl">
              {t("showroom.spaceTitle1")}
              <br />
              <span className="text-turbo">{t("showroom.spaceTitle2")}</span>
            </h2>
          </div>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>{t("showroom.p1")}</p>
            <p>{t("showroom.p2")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-border px-6 py-4 font-heading text-xs tracking-[0.2em] hover:border-turbo hover:text-turbo"
            >
              {t("showroom.bookViewing")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="mb-12">
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("showroom.galleryKicker")}
            </p>
            <h2 className="font-display text-5xl tracking-wide md:text-6xl">
              {t("showroom.galleryTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            <figure className="group relative aspect-[16/9] overflow-hidden bg-graphite sm:col-span-2 lg:col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GALLERY_BANNER}
                alt="GMS Turbo neon sign at the Tbilisi flagship"
                loading="lazy"
                width={1600}
                height={900}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-4 left-4 bg-background/85 px-3 py-1.5 font-mono text-[10px] tracking-widest text-muted-foreground backdrop-blur">
                GMS TURBO · TSERETELI AVE 114
              </figcaption>
            </figure>
            {GALLERY.map((g) => (
              <figure
                key={g.src}
                className="group relative aspect-[4/3] overflow-hidden bg-graphite"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.cap}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-4 left-4 bg-background/85 px-3 py-1.5 font-mono text-[10px] tracking-widest text-muted-foreground backdrop-blur">
                  {g.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-graphite">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("showroom.displayKicker")}
              </p>
              <h2 className="font-display text-5xl tracking-wide md:text-6xl">
                {t("showroom.collectionTitle")}
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden font-heading text-xs tracking-[0.2em] text-turbo hover:text-ember md:inline-flex"
            >
              {t("showroom.fullCatalog")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((p, i) => (
              <Link
                key={p.id}
                href={`/catalog/${p.id}`}
                className="group relative bg-background transition-colors hover:bg-carbon"
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
                    {t("showroom.plinth")} {String(i + 1).padStart(2, "0")}
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

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("showroom.visitKicker")}
              </p>
              <h2 className="font-display text-5xl leading-[0.95] md:text-6xl">
                {t("showroom.visit1")}
                <br />
                <span className="text-turbo">{t("showroom.visit2")}</span>
              </h2>
              <p className="mt-5 max-w-md text-sm text-muted-foreground">
                {t("showroom.visitBlurb")}
              </p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("showroom.addressLabel")}
              </p>
              <p className="font-display text-2xl leading-tight tracking-wide">
                TSERETELI AVE 114
                <br />
                TBILISI 0119
              </p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("showroom.callLabel")}
              </p>
              <p className="font-display text-2xl tracking-wide">
                +995 32 2 99 00 00
              </p>
              <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("showroom.emailLabel")}
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
