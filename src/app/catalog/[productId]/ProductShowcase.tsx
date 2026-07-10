"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";

export function ProductShowcase({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(0);
  const stockColor =
    product.stock === "IN STOCK"
      ? "text-foreground"
      : product.stock === "LOW STOCK"
        ? "text-ember"
        : "text-muted-foreground";

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-px bg-border lg:grid-cols-[1.15fr_1fr]">
        <div className="bg-background">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite lg:aspect-auto lg:h-full lg:min-h-[640px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.gallery[active]}
              alt={product.name}
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-5 top-5 bg-turbo px-3 py-1.5 font-mono text-[10px] tracking-widest text-white">
              {product.code}
            </span>
            <span
              className={`absolute right-5 top-5 border border-border bg-background/80 px-3 py-1.5 font-mono text-[10px] tracking-widest backdrop-blur ${stockColor}`}
            >
              {stockLabel(product.stock, lang)}
            </span>
            <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4 gap-px border-t border-border bg-border">
              {product.gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden bg-background ${
                    active === i ? "ring-2 ring-inset ring-turbo" : ""
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-background p-8 lg:p-12">
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              / {product.category}
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-foreground/90">
              {lang === "KA" ? product.taglineKa : product.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {lang === "KA" ? product.descriptionKa : product.description}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-px bg-border">
              <HeadlineStat
                label={t("product.maxBoost")}
                value={`${product.boost}`}
                unit="PSI"
              />
              <HeadlineStat
                label={t("product.hpPotential")}
                value={`${product.hp}`}
                unit="HP"
              />
              <HeadlineStat
                label={t("product.warranty")}
                value={
                  product.specs
                    .find((s) => s.label === "Warranty")
                    ?.value.split(" ")[0] ?? "12"
                }
                unit="MO"
              />
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {t("product.priceFrom")}
                </p>
                <p className="mt-1 font-display text-5xl text-turbo">
                  {product.price.toLocaleString()}
                  <span className="ml-2 text-xl text-foreground">GEL</span>
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <a
                href="#quote"
                className="inline-flex items-center justify-center bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white hover:bg-ember"
              >
                {t("product.requestQuote")}
              </a>
              <a
                href="tel:+995322990000"
                className="inline-flex items-center justify-center border border-border px-7 py-4 font-heading text-sm tracking-[0.2em] hover:border-turbo hover:text-turbo"
              >
                {t("product.callWorkshop")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeadlineStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-background p-4">
      <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl leading-none">
        {value}
        <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}
