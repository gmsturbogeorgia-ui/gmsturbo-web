"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Shared UI primitives.

   Every page used to re-type its own button as a ~90-character utility
   string, which is how the site ended up with four different paddings and
   three different hovers for the same control. These are canonical.

   House rules:
   - no `border-*`, no `ring-*` — elevation comes from the surface ramp
     (base → graphite → carbon → steel);
   - no `›` / `→` glyphs glued onto labels;
   - nothing square.
   ========================================================================== */

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center rounded-full font-sans font-semibold " +
  "whitespace-nowrap transition-[background-color,color,box-shadow,transform] " +
  "duration-300 ease-smooth active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  // turbo-deep, not turbo — white labels need 4.5:1 and the brighter red
  // only reaches 3.3:1. Same red to the eye.
  primary:
    "bg-turbo-deep text-white hover:bg-turbo hover:shadow-glow hover:-translate-y-0.5",
  secondary: "bg-carbon text-ink hover:bg-steel hover:-translate-y-0.5",
  quiet: "bg-transparent text-ink-soft hover:bg-graphite hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.8125rem]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[0.9375rem]",
};

function buttonClass(variant: Variant, size: Size, className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function Button({
  variant = "primary",
  size = "lg",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonAnchor({
  variant = "primary",
  size = "lg",
  className,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}

/**
 * Tertiary action. No arrow glyph — the underline that draws in on hover
 * carries the affordance instead.
 */
export function TextLink({
  href,
  children,
  className,
  tone = "turbo",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "turbo" | "ink";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block text-sm font-semibold underline decoration-transparent decoration-2 underline-offset-[6px]",
        "transition-[color,text-decoration-color] duration-300",
        tone === "turbo"
          ? "text-turbo hover:decoration-turbo"
          : "text-ink hover:text-turbo hover:decoration-turbo",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------------------
   Section scaffolding
   -------------------------------------------------------------------------- */

/**
 * Section header. `lead` sits in a right-hand column on wide screens rather
 * than stacking under the title — that offset is most of what makes a page
 * read as laid out rather than dumped.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-16",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)]">{title}</h2>
      </div>
      {(lead || action) && (
        <div className="flex max-w-sm shrink-0 flex-col items-start gap-4 md:pb-1.5">
          {lead && <p className="text-[0.9375rem] text-ink-soft">{lead}</p>}
          {action}
        </div>
      )}
    </div>
  );
}

/** Small pill for categories, platforms, stock states. */
export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "turbo" | "solid" | "onImage";
  className?: string;
}) {
  const tones = {
    neutral: "bg-carbon text-ink-soft",
    turbo: "bg-turbo-wash text-turbo",
    solid: "bg-turbo-deep text-white",
    onImage: "bg-base/70 text-ink backdrop-blur-md",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Interactive pill — filter chips, platform toggles.
 *
 * Multi-select needs the on-state to be unmistakable at a glance across a
 * row of twelve, so a selected chip both fills with brand red and grows a
 * tick. Colour alone would be the only signal otherwise, which fails for
 * red-green colour blindness and in bright sunlight.
 */
export function ChipButton({
  active = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full py-1.5 text-[0.8125rem] font-semibold",
        "transition-[background-color,color,padding] duration-300 ease-smooth",
        active
          ? "bg-turbo-deep pl-2.5 pr-3.5 text-white"
          : "bg-carbon px-3.5 text-ink-soft hover:bg-steel hover:text-ink",
        className,
      )}
      {...props}
    >
      {active && (
        <svg
          viewBox="0 0 16 16"
          className="h-3 w-3 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2.5 8.5l3.5 3.5 7.5-8" />
        </svg>
      )}
      {children}
    </button>
  );
}

/* The dropdown surface, shared by MultiSelect and SelectMenu so the two
   can't drift apart. Both shadows live in ONE class — tailwind-merge treats
   `shadow-lift` and `shadow-[inset…]` as the same group and would keep only
   the last, silently dropping the drop shadow. */
const MENU_PANEL =
  "absolute top-[calc(100%+8px)] z-50 max-h-72 overflow-auto rounded-2xl bg-carbon p-2 " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_24px_60px_-24px_rgba(0,0,0,0.9)]";

const MENU_ROW =
  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm " +
  "transition-colors duration-200";

const MENU_TRIGGER =
  "inline-flex items-center gap-2 rounded-full py-2.5 pl-4 pr-3.5 " +
  "text-[0.8125rem] font-semibold transition-colors duration-300 ease-smooth";

/** Shared close-on-outside-click / close-on-Escape behaviour. */
function useDismissable(
  open: boolean,
  close: () => void,
  ref: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}

/** Arrow/Home/End roving focus across menu rows. */
function useRovingFocus(count: number) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = count - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
    }
  };
  return { refs, onKeyDown };
}

/**
 * Single-select dropdown — the sort control.
 *
 * Replaces a native <select> that could only be styled by painting a chevron
 * on as a background-image, and whose popup was drawn by the OS in system
 * colours. This one matches the filter menus exactly.
 *
 * Unlike MultiSelect it closes on choose, because there is nothing else to
 * pick. `align="right"` anchors the panel to the trigger's right edge so it
 * can't run off the side of a phone.
 */
export function SelectMenu<T extends string>({
  ariaLabel,
  prefix,
  value,
  options,
  renderOption,
  onChange,
  align = "left",
  className,
}: {
  ariaLabel: string;
  /** Muted label inside the trigger. Hidden on narrow screens. */
  prefix?: string;
  value: T;
  options: readonly T[];
  renderOption: (value: T) => string;
  onChange: (value: T) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { refs, onKeyDown } = useRovingFocus(options.length);
  useDismissable(open, () => setOpen(false), wrapRef);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          MENU_TRIGGER,
          "max-w-full",
          open
            ? "bg-steel text-ink"
            : "bg-carbon text-ink-soft hover:bg-steel hover:text-ink",
        )}
      >
        {prefix && (
          <span className="hidden text-ink-mute sm:inline">{prefix}</span>
        )}
        <span className="truncate text-ink">{renderOption(value)}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            MENU_PANEL,
            "w-56",
            align === "right" ? "right-0" : "left-0",
          )}
          style={{ animation: "rise .22s var(--ease-smooth) both" }}
        >
          {options.map((o, i) => {
            const selected = o === value;
            return (
              <button
                key={o}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  MENU_ROW,
                  selected
                    ? "text-ink"
                    : "text-ink-soft hover:bg-steel hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center",
                    selected ? "text-turbo" : "text-transparent",
                  )}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                </span>
                {renderOption(o)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={cn(
        "ml-auto h-2 w-3 shrink-0 transition-transform duration-300 ease-smooth",
        open && "rotate-180",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 1.5L6 6.5L11 1.5" />
    </svg>
  );
}

/**
 * Multi-select dropdown.
 *
 * A trigger pill (so it sits in the same family as the buttons and chips)
 * opening a surface panel of toggleable rows. Selecting does NOT close the
 * menu — the whole point is picking several — and each change applies
 * immediately, so there's no OK/Cancel and no draft state to fall out of
 * sync with the URL.
 *
 * The tick box is a real second signal alongside the fill, so the on-state
 * doesn't rely on colour alone.
 */
export function MultiSelect<T extends string>({
  label,
  options,
  selected,
  renderOption,
  onToggle,
  onClear,
  allLabel = "All",
  className,
}: {
  label: string;
  options: readonly T[];
  selected: readonly T[];
  renderOption: (value: T) => string;
  onToggle: (value: T) => void;
  onClear: () => void;
  allLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { refs, onKeyDown } = useRovingFocus(options.length);
  useDismissable(open, () => setOpen(false), wrapRef);

  const count = selected.length;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          MENU_TRIGGER,
          "w-full",
          count > 0 || open
            ? "bg-steel text-ink"
            : "bg-carbon text-ink-soft hover:bg-steel hover:text-ink",
        )}
      >
        <span className="truncate">{label}</span>
        {count > 0 && (
          <span className="tnum inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-turbo-deep px-1.5 text-[0.6875rem] text-white">
            {count}
          </span>
        )}
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className={cn(MENU_PANEL, "left-0 w-full min-w-52")}
          style={{ animation: "rise .22s var(--ease-smooth) both" }}
        >
          <button
            type="button"
            onClick={onClear}
            className={cn(
              MENU_ROW,
              count === 0
                ? "text-ink"
                : "text-ink-soft hover:bg-steel hover:text-ink",
            )}
          >
            <TickBox checked={count === 0} />
            {allLabel}
          </button>

          {options.map((o, i) => {
            const checked = selected.includes(o);
            return (
              <button
                key={o}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => onToggle(o)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  MENU_ROW,
                  checked
                    ? "text-ink"
                    : "text-ink-soft hover:bg-steel hover:text-ink",
                )}
              >
                <TickBox checked={checked} />
                {renderOption(o)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TickBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] transition-colors duration-200",
        checked ? "bg-turbo-deep text-white" : "bg-steel text-transparent",
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-2.5 w-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 8.5l3.5 3.5 7.5-8" />
      </svg>
    </span>
  );
}

/** A figure with its label — used for the trust strips. */
export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <p className="tnum font-display text-[clamp(1.625rem,2.8vw,2.25rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
        {value}
      </p>
      <p className="mt-2.5 text-sm text-ink-mute">{label}</p>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Brand decoration
   -------------------------------------------------------------------------- */

const FLAME_BG: React.CSSProperties = {
  backgroundImage: "url('/flame-divider.svg')",
  backgroundRepeat: "repeat-x",
  backgroundSize: "auto 100%",
  backgroundPosition: "bottom center",
};

/**
 * Flame edge for a graphite band.
 *
 * The artwork is filled with graphite, not a colour, so it reads as the band
 * itself burning into the page rather than as a decal laid over it — its
 * solid baseline is what joins it seamlessly to the block it belongs to.
 *
 * Tiled (`auto 100%` + repeat-x) rather than stretched: the source is 4:1,
 * and scaling it to a 1920px viewport would squash every flame into a blob.
 *
 * @param flip Point the flames downward, for the BOTTOM edge of a band.
 * rotate-180 rather than scaleY(-1) — it mirrors horizontally too, so the
 * top and bottom edges of the same band don't read as tracing each other.
 */
export function FlameEdge({
  flip = false,
  className,
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("h-12 w-full md:h-16", flip && "rotate-180", className)}
      style={FLAME_BG}
    />
  );
}

/**
 * Tire skid. Caller supplies height, opacity and positioning.
 *
 * Tilted a degree off level — rubber never lands square to a page — with the
 * inner strip overscanned and the wrapper clipping what the rotation exposes
 * at the corners.
 */
export function TireTrack({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("overflow-hidden", className)}>
      <div
        className="h-full w-[110%] -translate-x-[5%] -rotate-1"
        style={{
          backgroundImage: "url('/tire-track.svg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}

/* --------------------------------------------------------------------------
   Form controls — filled surfaces, no outlines.
   -------------------------------------------------------------------------- */

export const INPUT =
  "w-full rounded-xl bg-carbon px-4 py-3 text-[0.9375rem] text-ink " +
  "transition-colors duration-200 placeholder:text-ink-mute " +
  "hover:bg-steel focus:bg-steel focus:outline-none " +
  "focus-visible:outline-none focus:ring-2 focus:ring-turbo/70";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-ink"
      >
        {label}
        {required && (
          <span className="ml-1 text-turbo" aria-hidden>
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={INPUT}
      />
    </div>
  );
}
