"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";
import { ButtonAnchor, Tag } from "@/components/Primitives";
import { cn } from "@/lib/utils";

export function ProductShowcase({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const { catLabel } = useTaxonomy();
  const [active, setActive] = useState(0);

  // `gallery` is optional in the CMS — a product added through the admin
  // without gallery rows arrives here as []. The old code read
  // gallery[active] straight out, which rendered <img> with NO src at all,
  // i.e. a blank hero image on every such product page. `img` is required,
  // so it's the guaranteed fallback.
  // getProducts already puts the lead image at the head of `gallery`; this
  // only catches a product whose image reference went missing entirely.
  const images = product.gallery.length > 0 ? product.gallery : [product.img];
  // Guard the index too, in case the list shrinks under a stale selection.
  const current = images[Math.min(active, images.length - 1)];

  const warrantyMonths =
    product.specs.find((s) => s.label === "Warranty")?.value.split(" ")[0] ??
    "12";

  return (
    <section className="shell grid gap-10 pb-16 pt-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-10">
      {/* Gallery — image, then a thumbnail rail underneath. The old version
          floated the thumbnails on top of the photo, covering the product. */}
      <div>
        <div className="overflow-hidden rounded-3xl bg-graphite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={product.name}
            width={1200}
            height={1200}
            fetchPriority="high"
            className="aspect-square w-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <ThumbnailRail
            images={images}
            active={active}
            onSelect={setActive}
          />
        )}
      </div>

      {/* Buy column */}
      <div className="lg:pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="neutral">{catLabel(product.category)}</Tag>
          <Tag tone={product.stock === "IN STOCK" ? "neutral" : "turbo"}>
            {stockLabel(product.stock, lang)}
          </Tag>
          <span className="text-sm text-ink-mute">{product.code}</span>
        </div>

        <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-bold">
          {product.name}
        </h1>

        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink">
          {product.tagline}
        </p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          {product.description}
        </p>

        {/* Headline figure, spaced rather than boxed. The published boost
            and horsepower numbers used to sit alongside it; they were dropped
            from the CMS, so the warranty stands on its own. */}
        <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
          <HeadlineStat
            label={t("product.warranty")}
            value={warrantyMonths}
            unit={lang === "KA" ? "თვე" : "mo"}
          />
        </dl>

        <div className="mt-10">
          {typeof product.price === "number" ? (
            <>
              <p className="text-sm text-ink-mute">{t("product.priceFrom")}</p>
              <p className="tnum mt-1 font-display text-[2.75rem] font-bold leading-none text-ink">
                {product.price.toLocaleString()}
                <span className="ml-2 text-xl font-semibold text-ink-mute">
                  GEL
                </span>
              </p>
            </>
          ) : (
            <p className="font-display text-[2rem] font-bold leading-none text-ink">
              {t("product.priceOnRequest")}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonAnchor href="#quote">
            {t("product.requestQuote")}
          </ButtonAnchor>
          <ButtonAnchor href="tel:+995551244222" variant="secondary">
            {t("product.callWorkshop")}
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}

/**
 * Horizontally scrollable thumbnail rail.
 *
 * Four 80px thumbs plus gaps overflow a 360px phone, so this scrolls rather
 * than squashing or wrapping. The native scrollbar is hidden — but only
 * because three other affordances replace it: scroll-snap, edge fades that
 * appear exactly when there is more content in that direction, and arrow-key
 * navigation. Hiding a scrollbar with nothing in its place would just make
 * the extra images invisible.
 */
function ThumbnailRail({
  images,
  active,
  onSelect,
}: {
  images: readonly string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    // The rail can become scrollable purely from a viewport resize, with no
    // scroll event to tell us about it.
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      ro.disconnect();
    };
  }, [syncEdges]);

  // Keep the selected thumb in view. Deliberately scrollTo on the rail
  // rather than scrollIntoView — the latter also scrolls the page
  // vertically, which yanks the product image off screen.
  useEffect(() => {
    const el = railRef.current;
    const child = el?.children[active] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (active + 1) % images.length;
    else if (e.key === "ArrowLeft")
      next = (active - 1 + images.length) % images.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = images.length - 1;
    if (next !== null) {
      e.preventDefault();
      onSelect(next);
      (railRef.current?.children[next] as HTMLElement | undefined)?.focus();
    }
  };

  return (
    <div className="relative mt-3">
      <div
        ref={railRef}
        role="group"
        aria-label="Product images"
        onKeyDown={onKeyDown}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
      >
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => onSelect(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={active === i}
            className={cn(
              "relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-xl bg-graphite",
              "transition-opacity duration-300 sm:h-20 sm:w-20",
              active === i ? "opacity-100" : "opacity-45 hover:opacity-80",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {active === i && (
              <span
                aria-hidden
                className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-turbo"
              />
            )}
          </button>
        ))}
      </div>

      {/* Edge fades — the "there is more this way" cue that replaces the
          hidden scrollbar. Each shows only when that side can actually
          scroll, so they never lie. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-base to-transparent transition-opacity duration-300",
          edges.left ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-base to-transparent transition-opacity duration-300",
          edges.right ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
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
    <div>
      <dt className="text-sm text-ink-mute">{label}</dt>
      <dd className="tnum mt-1.5 font-display text-3xl font-semibold leading-none text-ink">
        {value}
        <span className="ml-1.5 text-base font-medium text-ink-mute">
          {unit}
        </span>
      </dd>
    </div>
  );
}
