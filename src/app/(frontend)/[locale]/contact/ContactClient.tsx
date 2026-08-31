"use client";

import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  HomeIcon,
} from "@/components/Breadcrumb";
import { BookCallButton } from "@/components/Booking";
import { TireTrack } from "@/components/Primitives";
import { ShopMap } from "@/components/ShopMap";
import type { ContactContent } from "@/lib/getContact";
import { useLanguage } from "@/lib/i18n/context";

export function ContactClient({ contact }: { contact: ContactContent }) {
  const { lang, t } = useLanguage();
  const { hero, info, booking, findUs } = contact;

  // The map itself is OpenStreetMap, but "get me there" should still open
  // whatever navigation app the visitor actually uses, so the link out stays
  // a Google Maps directions URL pointed at the same pin.
  const { lat, lng, zoom } = findUs.map;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="shell pb-14 pt-10 md:pt-16">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <HomeIcon className="size-4" />
                  <span className="sr-only">{t("product.home")}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("nav.contact")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="eyebrow mt-6">{hero.tag}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,6.5vw,4.75rem)] font-bold">
            {hero.title1}{" "}
            <span className="text-turbo">
              {hero.title2}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {hero.blurb}
          </p>
        </section>

        {/* Reach us — four blocks of plain text, spaced. The old version was
            four bordered cells with a 1px gap showing the border through. */}
        <section className="shell pb-20">
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock label={info.phoneLabel}>
              <a
                href={`tel:${info.phone.replace(/\s+/g, "")}`}
                className="tnum font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                {info.phone}
              </a>
            </InfoBlock>

            <InfoBlock label={info.emailLabel}>
              <a
                href={`mailto:${info.email}`}
                className="font-display text-xl font-semibold text-ink transition-colors hover:text-turbo"
              >
                {info.email}
              </a>
            </InfoBlock>

            <InfoBlock label={info.addressLabel}>
              <p className="font-display text-xl font-semibold leading-snug text-ink">
                {info.addressLine1}
                <br />
                {info.addressLine2}
              </p>
            </InfoBlock>

            <InfoBlock label={info.hoursLabel}>
              <p className="font-display text-xl font-semibold text-ink">
                {info.hoursVal}
              </p>
              <p className="mt-2 text-sm text-ink-mute">
                {info.saturdayLabel} ·{" "}
                {info.saturdayVal}
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
                {booking.kicker}
              </p>
              <h2 className="mt-3 text-[clamp(1.875rem,4vw,3rem)]">
                {booking.title1}{" "}
                <span className="text-turbo">
                  {booking.title2}
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
                {booking.blurb}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <BookCallButton className="w-full sm:w-auto" />
            </div>
          </div>
        </section>

        {/* Find us — a live map instead of a still photo of the front. */}
        <section className="shell py-20">
          <p className="eyebrow">{findUs.kicker}</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)]">
            {findUs.title}
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl bg-graphite">
            <ShopMap
              lat={lat}
              lng={lng}
              zoom={zoom}
              label={t("contact.mapTitle")}
              className="aspect-[16/9] w-full md:aspect-[21/9]"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-sm text-ink-mute">
              {findUs.caption}
            </p>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-turbo underline decoration-transparent decoration-2 underline-offset-[6px] transition-[color,text-decoration-color] duration-300 hover:decoration-turbo"
            >
              {t("contact.mapCta")}
            </a>
          </div>
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
