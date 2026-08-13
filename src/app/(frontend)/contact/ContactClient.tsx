"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { BookCallButton } from "@/components/Booking";
import { TireTrack } from "@/components/Primitives";
import type { ContactContent } from "@/lib/getContact";
import { useLanguage } from "@/lib/i18n/context";

export function ContactClient({ contact }: { contact: ContactContent }) {
  const { lang } = useLanguage();
  const pick = (en: string, ka: string) => (lang === "KA" ? ka : en);
  const { hero, info, booking, findUs } = contact;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell pb-14 pt-10 md:pt-16">
          <p className="eyebrow">{pick(hero.tag, hero.tagKa)}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold">
            {pick(hero.title1, hero.title1Ka)}{" "}
            <span className="text-turbo">
              {pick(hero.title2, hero.title2Ka)}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {pick(hero.blurb, hero.blurbKa)}
          </p>
        </section>

        {/* Reach us — four blocks of plain text, spaced. The old version was
            four bordered cells with a 1px gap showing the border through. */}
        <section className="shell pb-20">
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock label={pick(info.phoneLabel, info.phoneLabelKa)}>
              <a
                href={`tel:${info.phone.replace(/\s+/g, "")}`}
                className="tnum font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                {info.phone}
              </a>
            </InfoBlock>

            <InfoBlock label={pick(info.emailLabel, info.emailLabelKa)}>
              <a
                href={`mailto:${info.email}`}
                className="font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                {info.email}
              </a>
            </InfoBlock>

            <InfoBlock label={pick(info.addressLabel, info.addressLabelKa)}>
              <p className="font-display text-xl font-semibold leading-snug text-ink">
                {pick(info.addressLine1, info.addressLine1Ka)}
                <br />
                {pick(info.addressLine2, info.addressLine2Ka)}
              </p>
            </InfoBlock>

            <InfoBlock label={pick(info.hoursLabel, info.hoursLabelKa)}>
              <p className="font-display text-xl font-semibold text-ink">
                {pick(info.hoursVal, info.hoursValKa)}
              </p>
              <p className="mt-2 text-sm text-ink-mute">
                {pick(info.saturdayLabel, info.saturdayLabelKa)} ·{" "}
                {pick(info.saturdayVal, info.saturdayValKa)}
              </p>
            </InfoBlock>
          </div>
        </section>

        <TireTrack className="mx-6 my-4 h-14 opacity-[0.22] md:my-8 md:h-20" />

        {/* Book a call */}
        <section className="shell">
          <div className="grid items-center gap-10 rounded-[2rem] bg-turbo-wash px-6 py-14 md:px-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
            <div>
              <p className="eyebrow text-turbo">
                {pick(booking.kicker, booking.kickerKa)}
              </p>
              <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
                {pick(booking.title1, booking.title1Ka)}{" "}
                <span className="text-turbo">
                  {pick(booking.title2, booking.title2Ka)}
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                {pick(booking.blurb, booking.blurbKa)}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <BookCallButton className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* Find us */}
        <section className="shell py-20">
          <p className="eyebrow">{pick(findUs.kicker, findUs.kickerKa)}</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)]">
            {pick(findUs.title, findUs.titleKa)}
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={findUs.image}
              alt="The GMS Turbo Georgia showroom at Tsereteli Ave 114, Tbilisi"
              loading="lazy"
              width={1536}
              height={1024}
              className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
            />
          </div>
          <p className="mt-4 text-sm text-ink-mute">
            {pick(findUs.caption, findUs.captionKa)}
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
