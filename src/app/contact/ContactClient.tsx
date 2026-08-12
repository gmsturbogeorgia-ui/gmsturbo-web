"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton } from "@/components/Booking";
import { useLanguage } from "@/lib/i18n/context";

const findImg = "/images/showroom-display-minimal.jpeg";

export function ContactClient() {
  const { t } = useLanguage();
  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell pb-14 pt-10 md:pt-16">
          <p className="eyebrow">{t("contact.tag")}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold">
            {t("contact.title1")}{" "}
            <span className="text-turbo">{t("contact.title2")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {t("contact.blurb")}
          </p>
        </section>

        {/* Reach us — four blocks of plain text, spaced. The old version was
            four bordered cells with a 1px gap showing the border through. */}
        <section className="shell pb-20">
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock label={t("contact.phoneLabel")}>
              <a
                href="tel:+995322990000"
                className="tnum font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                +995 32 2 99 00 00
              </a>
            </InfoBlock>

            <InfoBlock label={t("contact.emailLabel")}>
              <a
                href="mailto:showroom@gmsturbo.ge"
                className="font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                showroom@gmsturbo.ge
              </a>
            </InfoBlock>

            <InfoBlock label={t("contact.addressLabel")}>
              <p className="font-display text-xl font-semibold leading-snug text-ink">
                Tsereteli Ave 114
                <br />
                Tbilisi 0119
              </p>
            </InfoBlock>

            <InfoBlock label={t("contact.hoursLabel")}>
              <p className="font-display text-xl font-semibold text-ink">
                {t("contact.hoursVal")}
              </p>
              <p className="mt-2 text-sm text-ink-mute">
                {t("contact.saturdayLabel")} · {t("contact.saturdayVal")}
              </p>
            </InfoBlock>
          </div>
        </section>

        {/* Book a call */}
        <section className="shell">
          <div className="grid items-center gap-10 rounded-[2rem] bg-turbo-wash px-6 py-14 md:px-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
            <div>
              <p className="eyebrow text-turbo">{t("contact.bookKicker")}</p>
              <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
                {t("contact.bookTitle1")}{" "}
                <span className="text-turbo">{t("contact.bookTitle2")}</span>
              </h2>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                {t("contact.bookBlurb")}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <BookCallButton className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* Find us */}
        <section className="shell py-20">
          <p className="eyebrow">{t("contact.findKicker")}</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)]">
            {t("contact.findTitle")}
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={findImg}
              alt="The GMS Turbo Georgia showroom at Tsereteli Ave 114, Tbilisi"
              loading="lazy"
              width={1536}
              height={1024}
              className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
            />
          </div>
          <p className="mt-4 text-sm text-ink-mute">
            Tsereteli Ave 114 · Tbilisi
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      {children}
    </div>
  );
}
