"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useLanguage } from "@/lib/i18n/context";

const showroomImg = "/images/showroom.svg";
const HIGHLIGHTS = PRODUCTS.slice(0, 6);

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
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-turbo" />
              <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
                {t("showroom.tag")}
              </span>
            </div>
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
              href="/#contact"
              className="inline-flex items-center gap-3 border border-border px-6 py-4 font-heading text-xs tracking-[0.2em] hover:border-turbo hover:text-turbo"
            >
              {t("showroom.bookViewing")}
            </Link>
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
