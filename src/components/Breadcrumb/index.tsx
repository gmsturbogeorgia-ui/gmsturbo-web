"use client";

import { LocaleLink as Link } from "@/components/LocaleLink";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Breadcrumbs.

   Same composition as the shadcn/ui breadcrumb — Breadcrumb → List → Item →
   Link/Page, with Separator between — so a trail reads as its markup. Two
   things are ours rather than the reference's:

   - the pill is a filled surface, not an outlined one. `border` is what the
     original draws its shape with; here the shape comes from graphite on
     base plus the same inset top highlight the product tiles use, because
     nothing on this site is outlined;
   - the home icon is inline SVG. It is one 24px path, and pulling an icon
     package in for it would be the only runtime dependency on this page.

   The separator is "/" — a path separator, not a chevron. It is marked
   presentational, so a screen reader hears "Home, Catalog, GT2860RS" and not
   a slash between each.
   ========================================================================== */

export function Breadcrumb({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full bg-graphite px-3 text-sm",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]",
        className,
      )}
    >
      {children}
    </ol>
  );
}

export function BreadcrumbItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("inline-flex items-center gap-1.5", className)}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-1.5 text-ink-mute",
        "transition-colors duration-300 hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}

/** The crumb for the page you are on: named, but not a link to itself. */
export function BreadcrumbPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-ink", className)}
    >
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <li role="presentation" aria-hidden className={cn("text-ink-mute/70", className)}>
      {children ?? "/"}
    </li>
  );
}

/** House icon, drawn rather than imported. Inherits colour and size. */
export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}
