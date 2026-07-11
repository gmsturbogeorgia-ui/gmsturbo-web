"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton } from "@/components/Booking";
import { useLanguage } from "@/lib/i18n/context";

const findImg = "/images/showroom-display-minimal.jpeg";

export function ContactClient() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
          <p className="mb-8 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("contact.tag")}
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.86] tracking-tight">
            {t("contact.title1")}
            <br />
            <span className="text-turbo">{t("contact.title2")}</span>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("contact.blurb")}
          </p>
        </div>
      </section>

      {/* 01 — Reach us */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <p className="mb-10 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("contact.reachKicker")}
          </p>
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            <InfoCard label={t("contact.phoneLabel")}>
              <a
                href="tel:+995322990000"
                className="font-display text-2xl tracking-wide hover:text-turbo"
              >
                +995 32 2 99 00 00
              </a>
            </InfoCard>
            <InfoCard label={t("contact.emailLabel")}>
              <a
                href="mailto:showroom@gmsturbo.ge"
                className="font-display text-2xl tracking-wide hover:text-turbo"
              >
                SHOWROOM@GMSTURBO.GE
              </a>
            </InfoCard>
            <InfoCard label={t("contact.addressLabel")}>
              <p className="font-display text-2xl leading-tight tracking-wide">
                TSERETELI AVE 114
                <br />
                TBILISI 0119
              </p>
            </InfoCard>
            <InfoCard label={t("contact.hoursLabel")}>
              <p className="font-display text-2xl tracking-wide">
                {t("contact.hoursVal")}
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("contact.saturdayLabel")} · {t("contact.saturdayVal")}
              </p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* 02 — Book a call */}
      <section className="border-b border-border bg-graphite">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              {t("contact.bookKicker")}
            </p>
            <h2 className="font-display text-5xl leading-[0.95] md:text-6xl">
              {t("contact.bookTitle1")}
              <br />
              <span className="text-turbo">{t("contact.bookTitle2")}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("contact.bookBlurb")}
            </p>
          </div>
          <div className="flex lg:justify-end">
            <BookCallButton className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      {/* 03 — Find us */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <p className="mb-8 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("contact.findKicker")}
          </p>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-graphite md:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={findImg}
              alt="GMS Turbo Georgia showroom, Tsereteli Ave 114, Tbilisi"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-background/90 px-5 py-4 font-mono text-[10px] tracking-widest text-muted-foreground backdrop-blur">
              <span>{t("contact.findTitle")}</span>
              <span>TSERETELI AVE 114 · TBILISI</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background p-7">
      <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
