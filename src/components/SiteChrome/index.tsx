"use client";

import { LocaleLink as Link, useLocale } from "@/components/LocaleLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useBooking } from "@/components/Booking";
import { Button, FlameEdge, TextLink } from "@/components/Primitives";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "nav.catalog", href: "/catalog" },
  { key: "nav.showroom", href: "/showroom" },
  { key: "nav.contact", href: "/contact" },
] as const;

/**
 * Whether `href` is the section the reader is currently in.
 *
 * The two paths aren't directly comparable: usePathname() reports the real
 * URL, locale segment and all ("/ka/catalog"), while NAV hrefs are written
 * bare ("/catalog") because LocaleLink adds the prefix at render time. A
 * plain startsWith between the two is false for every link on every page,
 * which is why the header had an active style that never once rendered.
 *
 * The trailing-slash arm keeps the parent lit on child routes, so a product
 * page still marks Catalog as current.
 */
function isCurrent(pathname: string, locale: string, href: string) {
  const path = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1) || "/"
    : pathname;
  return path === href || path.startsWith(`${href}/`);
}

/* --------------------------------------------------------------------------
   The GMS turbine mark — brand asset, traced from src/assets/turbo-mark.svg.

   Inlined rather than loaded as an <img>, for two reasons: `currentColor`
   lets it take the brand red from whatever it sits inside (and invert
   anywhere it needs to), and it can't flash or 404 on a cold cache.

   Kept exactly as exported: the translate/scale(0.1, -0.1) wrapper is
   potrace's own coordinate flip, and the original's hard-coded fill="#000000"
   is the one thing changed.
   -------------------------------------------------------------------------- */
function TurboMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <g
        transform="translate(0,512) scale(0.1,-0.1)"
        fill="currentColor"
        stroke="none"
      >
        <path d="M4320 4867 c-49 -16 -133 -102 -148 -153 -17 -59 -17 -1289 0 -1348 16 -55 99 -138 154 -154 57 -17 571 -17 628 0 55 16 138 99 154 154 17 58 17 1289 0 1346 -6 22 -31 62 -55 88 -69 77 -88 80 -417 79 -174 -1 -294 -5 -316 -12z" />
        <path d="M2060 4713 c-180 -13 -454 -76 -628 -144 -673 -264 -1188 -845 -1361 -1535 -53 -211 -65 -318 -65 -554 0 -231 12 -343 60 -535 198 -796 817 -1424 1604 -1629 221 -57 327 -70 570 -70 236 0 343 12 554 65 779 195 1407 819 1610 1599 57 221 70 327 70 570 0 216 -10 316 -49 487 l-16 71 -59 6 c-79 9 -186 63 -239 122 -39 42 -101 153 -101 182 0 9 -80 12 -366 12 l-366 0 24 -32 c143 -190 232 -383 275 -596 25 -124 24 -385 -1 -507 -77 -373 -290 -687 -601 -887 -142 -92 -315 -161 -483 -195 -124 -25 -385 -24 -507 1 -774 160 -1251 907 -1064 1665 111 448 458 819 901 965 402 131 860 60 1207 -189 l90 -65 201 0 200 0 0 600 0 600 -707 -2 c-390 -1 -728 -3 -753 -5z" />
        <path d="M3680 4120 l0 -600 160 0 160 0 0 600 0 600 -160 0 -160 0 0 -600z" />
        <path d="M2120 3675 c-8 -2 -49 -9 -90 -15 -358 -58 -694 -309 -862 -645 -89 -177 -122 -320 -123 -530 0 -163 11 -239 56 -377 58 -179 155 -335 293 -474 174 -174 386 -287 631 -335 103 -21 349 -18 455 5 362 78 668 314 834 644 84 168 121 329 121 532 0 157 -12 236 -56 372 -96 297 -319 557 -599 698 -167 84 -307 119 -505 125 -77 2 -147 2 -155 0z m266 -166 c153 -21 331 -92 459 -184 68 -48 205 -187 251 -255 81 -118 146 -280 169 -425 55 -338 -56 -668 -307 -911 -119 -115 -237 -187 -393 -241 -308 -105 -680 -45 -941 150 -70 53 -196 183 -241 248 -177 257 -229 598 -136 894 54 173 141 312 274 440 98 94 146 129 255 183 190 96 400 130 610 101z" />
        <path d="M2085 3345 c-127 -23 -260 -80 -358 -152 l-49 -36 229 -229 c125 -125 233 -228 240 -228 10 0 13 72 13 330 0 182 -1 330 -2 329 -2 0 -34 -7 -73 -14z" />
        <path d="M2320 3028 c0 -257 3 -328 13 -328 7 0 115 103 241 229 l229 229 -44 32 c-108 78 -255 139 -381 158 l-58 9 0 -329z" />
        <path d="M1526 2994 c-72 -98 -136 -254 -154 -376 l-9 -58 329 0 c257 0 328 3 328 13 0 7 -103 115 -229 241 l-229 229 -36 -49z" />
        <path d="M2687 2812 c-125 -125 -227 -233 -227 -240 0 -9 73 -12 328 -12 l329 0 -9 58 c-18 114 -60 225 -124 328 -24 39 -50 76 -57 82 -10 9 -64 -40 -240 -216z" />
        <path d="M2185 2535 c-50 -49 -15 -135 55 -135 19 0 40 9 55 25 16 15 25 36 25 55 0 19 -9 40 -25 55 -15 16 -36 25 -55 25 -19 0 -40 -9 -55 -25z" />
        <path d="M1372 2343 c18 -124 76 -265 149 -367 l42 -58 228 228 c126 126 229 234 229 241 0 10 -71 13 -328 13 l-329 0 9 -57z" />
        <path d="M2460 2387 c0 -7 103 -115 228 -240 l229 -229 36 49 c74 101 137 253 155 376 l9 57 -329 0 c-257 0 -328 -3 -328 -13z" />
        <path d="M1907 2032 l-229 -229 49 -36 c101 -74 253 -137 376 -155 l57 -9 0 329 c0 257 -3 328 -13 328 -7 0 -115 -103 -240 -228z" />
        <path d="M2320 1932 l0 -329 58 9 c122 18 278 82 376 154 l49 36 -229 229 c-126 126 -234 229 -241 229 -10 0 -13 -71 -13 -328z" />
      </g>
    </svg>
  );
}

/**
 * @param onImage Sitting over hero photography rather than the page
 * background. Muted greys disappear against a photo, so secondary text steps
 * up to translucent white.
 */
export function Logo({ onImage = false }: { onImage?: boolean } = {}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="GMS Turbo Georgia - home"
    >
      {/* Scale, not spin. The mark isn't radially symmetric — it has the
          housing tab at top right — so rotating it throws the whole glyph
          off balance instead of reading as a wheel turning. */}
      <TurboMark className="shrink-0 text-turbo transition-transform duration-500 ease-smooth group-hover:scale-110" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">
          GMS Turbo
        </span>
        <span
          className={cn(
            "mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.22em]",
            onImage ? "text-ink/65" : "text-ink-mute",
          )}
        >
          Georgia
        </span>
      </span>
    </Link>
  );
}

function LangToggle({
  compact = false,
  onImage = false,
}: {
  compact?: boolean;
  onImage?: boolean;
}) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-0.5",
        onImage ? "bg-ink/10 backdrop-blur-md" : "bg-graphite",
        compact && "w-full",
      )}
    >
      {(["KA", "EN"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-smooth",
            compact && "flex-1",
            lang === code
              ? onImage
                ? "bg-ink/25 text-ink"
                : "bg-steel text-ink"
              : onImage
                ? "text-ink/75 hover:text-ink"
                : "text-ink-mute hover:text-ink",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/**
 * @param overlay Render transparent while at the top of the page, so a
 * full-bleed hero image can run underneath it. Once scrolled it takes the
 * usual blurred background regardless.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean } = {}) {
  const pathname = usePathname();
  const locale = useLocale();
  const { t } = useLanguage();
  const { open: openBooking } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Blur only kicks in once the page has moved. At rest the header sits on
  // the hero with nothing drawn around it — no rule, no divider.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // True only while the bar is actually sitting on the hero photograph.
  const onImage = overlay && !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-500 ease-smooth",
        scrolled || menuOpen
          ? "bg-base/85 backdrop-blur-xl"
          : overlay
            ? // Not fully transparent: a short top-down scrim. Pure
              // transparency left the nav's legibility at the mercy of
              // whatever the photo happened to be doing behind it — over the
              // showroom's lit ceiling the links washed out completely. The
              // gradient guarantees contrast without reading as a bar.
              "bg-gradient-to-b from-base/85 via-base/45 to-transparent"
            : "bg-base",
      )}
    >
      <div className="shell flex h-18 items-center justify-between gap-6">
        <Logo onImage={onImage} />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const isActive = isCurrent(pathname, locale, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-4 py-2 font-display text-sm font-semibold transition-colors duration-300",
                  // Current page is marked in brand red and nothing else —
                  // no pill, no rule, no dot. That makes it the only coloured
                  // word in the bar, which reads faster than a filled shape
                  // and keeps the header to the house rule of no boxes.
                  //
                  // Hover is colour-only for the same reason: a hover pill
                  // would give an idle link more visual weight than the page
                  // the reader is actually on. ink-mute (#6f6a67) is tuned
                  // for the near-black page and is far too dim over
                  // photography — hence the brighter ramp on the hero.
                  isActive
                    ? "text-turbo"
                    : onImage
                      ? "text-ink/80 hover:text-ink"
                      : "text-ink-mute hover:text-ink",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <LangToggle onImage={onImage} />
          </div>
          <Button
            size="md"
            onClick={openBooking}
            className="hidden md:inline-flex"
          >
            {t("nav.bookCall")}
          </Button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors md:hidden",
              onImage
                ? "bg-ink/10 backdrop-blur-md hover:bg-ink/20"
                : "bg-graphite hover:bg-carbon",
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 rounded bg-current transition-all duration-300 ease-smooth",
                  menuOpen ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 block h-0.5 w-4 rounded bg-current transition-opacity duration-200",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-4 rounded bg-current transition-all duration-300 ease-smooth",
                  menuOpen ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="bg-base md:hidden">
          <div className="shell flex flex-col gap-1 pb-5">
            {NAV.map((item) => {
              const isActive = isCurrent(pathname, locale, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "px-3 py-3 font-display text-xl font-semibold transition-colors",
                    isActive ? "text-turbo" : "text-ink hover:text-turbo",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-3">
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  openBooking();
                }}
                className="w-full"
              >
                {t("nav.bookCall")}
              </Button>
              <div className="sm:hidden">
                <LangToggle compact />
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

// The real profiles, in the order they get the most traffic. Hardcoded
// rather than CMS-driven because these change roughly never, and a dead
// social link is worse than one that needs a deploy to move.
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/turbogms/" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/GMS-TURBO-61566147999204/",
  },
  { label: "TikTok", href: "https://www.tiktok.com/@gmsturbogeorgia" },
];

/* --------------------------------------------------------------------------
   Footer. Sits one step up the surface ramp (graphite) so it separates from
   the page without a divider line being drawn.
   -------------------------------------------------------------------------- */
export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-24">
      <FlameEdge />
      <div className="bg-graphite">
        <div className="shell py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft">
                {t("footer.blurb")}
              </p>
              <div className="mt-8">
                <TextLink href="/contact">{t("footer.contact")}</TextLink>
              </div>
            </div>

            <FooterCol title={t("footer.navigation")}>
              <FooterLink href="/catalog">{t("footer.catalog")}</FooterLink>
              <FooterLink href="/showroom">{t("footer.showroom")}</FooterLink>
              <FooterLink href="/contact">{t("footer.contact")}</FooterLink>
            </FooterCol>

            <FooterCol title={t("footer.connect")}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[0.9375rem] text-ink-soft transition-colors duration-300 hover:text-turbo"
                >
                  {s.label}
                </a>
              ))}
            </FooterCol>
          </div>

          <div className="mt-14 flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1 text-sm text-ink-mute sm:flex-row sm:gap-6">
              <a
                href="tel:+995551244222"
                className="tnum transition-colors hover:text-ink"
              >
                +995 551 24 42 22
              </a>
              <span className="hidden sm:inline">·</span>
              <span>{t("footer.address")}</span>
            </div>
            <p className="text-sm text-ink-mute">
              © {new Date().getFullYear()} GMS Turbo Georgia -{" "}
              {t("footer.builtBy")}{" "}
              <a
                href="https://gargari.ge"
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-soft transition-colors duration-300 hover:text-turbo"
              >
                GARGARI
              </a>
              {t("footer.builtBySuffix")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-5">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[0.9375rem] text-ink-soft transition-colors duration-300 hover:text-turbo"
    >
      {children}
    </Link>
  );
}
