import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { label: "INVENTORY", to: "/catalog" as const },
  { label: "SERVICES", to: "/services" as const },
  { label: "SHOWROOM", to: "/showroom" as const },
  { label: "GARAGE", to: "/" as const, hash: "services" },
] as const;

export function SiteHeader() {
  const [lang, setLang] = useState<"KA" | "EN">("KA");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-2">
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
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={"hash" in item ? item.hash : undefined}
              className="font-heading text-xs tracking-[0.18em] text-foreground/80 transition-colors hover:text-turbo"
              activeProps={{ className: "text-turbo" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
                key={item.label}
                to={item.to}
                hash={"hash" in item ? item.hash : undefined}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-heading text-xs tracking-[0.2em] text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
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
              Premium turbocharger sales, diagnostics, repair and performance
              solutions — engineered in Tbilisi since 2014.
            </p>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              NAVIGATION
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="hover:text-turbo">
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-turbo">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/showroom" className="hover:text-turbo">
                  Showroom
                </Link>
              </li>
              <li>
                <Link to="/" hash="contact" className="hover:text-turbo">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] tracking-widest text-muted-foreground">
              CONNECT
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
          <span>© 2026 GMS TURBO GEORGIA · INDUSTRIAL PRECISION</span>
          <span>BUILT IN TBILISI · ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
