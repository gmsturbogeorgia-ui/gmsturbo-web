"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useBooking } from "@/components/Booking";

const NAV = [
  { key: "nav.inventory", href: "/catalog" },
  { key: "nav.showroom", href: "/showroom" },
  { key: "nav.contact", href: "/contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { open: openBooking } = useBooking();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-wider">
            GMS
          </span>
          <span className="font-display text-2xl leading-none tracking-wider text-turbo">
            TURBO
          </span>
          <span className="font-display text-2xl leading-none tracking-wider">
            GEORGIA
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`font-heading text-xs tracking-[0.18em] transition-colors hover:text-turbo ${
                  isActive ? "text-turbo" : "text-foreground/80"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={openBooking}
            className="hidden bg-turbo px-4 py-2 font-heading text-[11px] tracking-[0.2em] text-white transition-colors hover:bg-ember md:inline-flex"
          >
            {t("nav.bookCall")}
          </button>
          <div className="flex items-center border border-border">
            {(["KA", "EN"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 font-mono text-[11px] tracking-widest transition-colors ${
                  lang === code
                    ? "bg-turbo text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="border border-border p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="block h-px w-5 bg-foreground" />
            <span className="mt-1 block h-px w-5 bg-foreground" />
            <span className="mt-1 block h-px w-5 bg-foreground" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-heading text-xs tracking-[0.2em] text-foreground/80"
              >
                {t(item.key)}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="mt-4 bg-turbo px-5 py-3 text-center font-heading text-xs tracking-[0.2em] text-white"
            >
              {t("nav.bookCall")}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl tracking-wider">GMS</span>
              <span className="font-display text-2xl tracking-wider text-turbo">
                TURBO
              </span>
              <span className="font-display text-2xl tracking-wider">
                GEORGIA
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              {t("footer.blurb")}
            </p>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("footer.navigation")}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-turbo">
                  {t("footer.inventory")}
                </Link>
              </li>
              <li>
                <Link href="/showroom" className="hover:text-turbo">
                  {t("footer.showroom")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-turbo">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("footer.connect")}
            </p>
            <ul className="space-y-2 text-sm">
              {["Instagram", "Facebook", "YouTube", "TikTok"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-turbo">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-[10px] tracking-widest text-muted-foreground md:flex-row md:items-center">
          <span>© 2026 GMS TURBO GEORGIA · {t("footer.precisionTag")}</span>
          <span>{t("footer.builtIn")}</span>
        </div>
      </div>
    </footer>
  );
}
