"use client";

import { LocaleLink as Link } from "@/components/LocaleLink";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";
import { useTaxonomy } from "@/lib/i18n/taxonomy-context";
import { Highlighted } from "@/components/ProductSearch";
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
   two specs that decide the purchase, and which platforms it fits, the way
   a clothing tile shows sizes.

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

        {/* The two numbers that actually decide the purchase. */}
        <p className="tnum mt-1.5 text-xs text-ink-mute">
          {product.boost} PSI
          <span className="mx-1.5 text-ink-mute/50">·</span>
          {product.hp} HP
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="tnum text-[0.9375rem] font-semibold text-ink">
            {product.price.toLocaleString()}
            <span className="ml-1 text-xs font-medium text-ink-mute">GEL</span>
          </p>

          <p className="truncate text-[0.6875rem] text-ink-mute">
            {shownPlatforms.map(vehLabel).join(" · ")}
            {extraPlatforms > 0 && ` +${extraPlatforms}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

/** The grid these tiles live in. Two-up on phones, like every real shop. */
export function ProductGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Tighter than before: the tiles carry their own padding now, so
        // large gutters would double the spacing between them.
        "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
