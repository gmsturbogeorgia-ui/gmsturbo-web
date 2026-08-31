"use client";

import { LocaleLink as Link } from "@/components/LocaleLink";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";
import { Highlighted } from "@/components/ProductSearch";
import { FlameEdge } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/* ==========================================================================
   The product tile. One component, used by the home page, the catalog, the
   showroom and the related rail — previously four near-identical copies that
   had drifted apart.

   Each tile reads as its own object, but nothing is outlined. The
   separation is a filled panel one step up the surface ramp (graphite on
   base) with a 1px inset highlight along its top edge — the way light
   catches a real raised surface. That's a material cue, not a drawn border,
   so the grid never looks like a table of cells.

   The rest of the richness comes from things a shopper actually uses: the
   price, and which platforms it fits, the way a clothing tile shows sizes.

   Radii are nested properly — outer 22px minus 10px of padding gives a 12px
   inner radius, so the image corner stays concentric with the panel corner.
   ========================================================================== */

export function ProductCard({
  product,
  query,
  priority = false,
}: {
  product: Product;
  /** Search term to highlight, when rendered inside catalog results. */
  query?: string;
  priority?: boolean;
}) {
  const { t, lang } = useLanguage();
  const { catLabel, vehLabel } = useTaxonomy();

  // Only flag stock when it's something the buyer must act on. "In stock" is
  // the default state and doesn't earn a badge.
  const flag =
    product.stock === "IN STOCK" ? null : stockLabel(product.stock, lang);

  const shownPlatforms = product.vehicles.slice(0, 2);
  const extraPlatforms = product.vehicles.length - shownPlatforms.length;

  return (
    <Link
      href={`/catalog/${product.id}`}
      className={cn(
        "group block rounded-[1.375rem] bg-graphite p-2.5",
        // The "border that isn't one": a hairline of light along the top
        // edge only, at 5% white. Reads as a lit surface, not an outline.
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]",
        "transition-[background-color,box-shadow,transform] duration-500 ease-smooth",
        "hover:-translate-y-1 hover:bg-carbon hover:shadow-lift",
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[0.75rem] bg-base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06]"
        />

        {/* Grounds the product and gives the hover pill something to sit on. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {flag && (
          <span className="absolute left-3 top-3 rounded-full bg-base/70 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink backdrop-blur-md">
            {flag}
          </span>
        )}

        <span className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-1.5 rounded-full bg-ink/95 py-2 text-center text-[0.8125rem] font-semibold text-base opacity-0 backdrop-blur transition-[opacity,transform] duration-400 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
          {t("common.viewDetail")}
        </span>
      </div>

      <div className="px-1.5 pb-1.5 pt-3.5">
        <p className="text-xs text-ink-mute">
          {catLabel(product.category)}
        </p>

        <h3 className="mt-1 text-[0.9375rem] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-turbo">
          {query ? (
            <Highlighted text={product.name} query={query} />
          ) : (
            product.name
          )}
        </h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          {typeof product.price === "number" ? (
            <p className="tnum text-[0.9375rem] font-semibold text-ink">
              {product.price.toLocaleString()}
              <span className="ml-1 text-xs font-medium text-ink-mute">
                GEL
              </span>
            </p>
          ) : (
            <p className="text-[0.9375rem] font-semibold text-ink-soft">
              {t("product.priceOnRequest")}
            </p>
          )}

          <p className="truncate text-[0.6875rem] text-ink-mute">
            {shownPlatforms.map(vehLabel).join(" · ")}
            {extraPlatforms > 0 && ` +${extraPlatforms}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ==========================================================================
   The promo tile that leads a product grid.

   Same panel as the product tile — same radius, same graphite fill, same
   inset top highlight — so it sits IN the grid rather than on top of it.
   What separates it is material, not an outline: an ember wash pooling in
   the floor of the panel, with the flame edge burning up out of it. The
   flame artwork is filled graphite, so it reads as the panel's own floor
   catching light rather than as a decal.

   It occupies one cell on phones and on wide screens, and stretches across
   the full row on tablets, where three columns would otherwise leave the
   last product tile orphaned on a line of its own.
   ========================================================================== */

export function BrowseAllCard({ className }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <Link
      href="/catalog"
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden",
        "rounded-[1.375rem] bg-graphite p-5 md:p-6",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]",
        "transition-[background-color,box-shadow,transform] duration-500 ease-smooth",
        "hover:-translate-y-1 hover:bg-carbon hover:shadow-lift",
        className,
      )}
    >
      {/* Ember pooling in the floor of the panel. A radial rather than a
          linear wash, so the glow has a source — it sits under the flames
          the way heat sits under a flame front. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(130%_100%_at_50%_118%,rgba(255,74,43,0.38),rgba(255,74,43,0.12)_46%,transparent_74%)] opacity-90 transition-opacity duration-500 group-hover:opacity-100"
      />
      <FlameEdge className="pointer-events-none absolute inset-x-0 bottom-0 h-11 w-full md:h-14" />

      <div className="relative">
        <p className="eyebrow">{t("home.browseKicker")}</p>
        <h3 className="mt-2.5 font-display text-[clamp(1.0625rem,1.4vw,1.4rem)] font-semibold leading-[1.2] text-ink">
          {t("home.browseTitle")}
        </h3>
        <p className="mt-2 hidden text-[0.8125rem] leading-relaxed text-ink-soft sm:block md:max-w-xs">
          {t("home.browseBlurb")}
        </p>
      </div>

      {/* A span, not a button — the whole panel is already the link, and a
          control nested inside one is invalid markup. */}
      <span className="relative mt-8 inline-flex w-fit items-center rounded-full bg-ink px-5 py-2.5 font-display text-[0.8125rem] font-semibold text-base transition-[background-color,color] duration-300 ease-smooth group-hover:bg-turbo-deep group-hover:text-white">
        {t("home.browseCta")}
      </span>
    </Link>
  );
}

/**
 * The grid these tiles live in. Two-up on phones, like every real shop.
 *
 * `rail` swaps the phone layout for a horizontal slider — for a curated row
 * like the home page's, where the point is a taste of the catalog rather
 * than a complete listing. A tile takes 65% of the width so the next one
 * shows a 35% sliver: the cut-off card is what tells a thumb there is more
 * to the right, which a tidy two-up grid never does. It reverts to the
 * normal grid from `sm` up, where a full row fits without squashing.
 *
 * The rail is pulled out to the screen edges (negative margin + matching
 * padding) so cards scroll off the edge of the phone rather than stopping
 * inside the page gutter, while the first one still lines up with the
 * heading above it.
 */
export function ProductGrid({
  children,
  className,
  rail = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Horizontal slider instead of a grid below `sm`. */
  rail?: boolean;
}) {
  return (
    <div
      className={cn(
        // Tighter than before: the tiles carry their own padding now, so
        // large gutters would double the spacing between them.
        "gap-3 md:gap-4",
        rail
          ? cn(
              "no-scrollbar -mx-[1.125rem] flex snap-x snap-mandatory scroll-px-[1.125rem]",
              "overflow-x-auto scroll-smooth px-[1.125rem]",
              "[&>*]:w-[65%] [&>*]:shrink-0 [&>*]:snap-start",
              // Back to a grid once a row fits: the rail's flex/scroll
              // mechanics and the child width all have to be undone.
              "sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0",
              "sm:[&>*]:w-auto md:grid-cols-3 lg:grid-cols-4",
            )
          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
