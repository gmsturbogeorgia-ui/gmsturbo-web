"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INPUT } from "@/components/Primitives";
import type { CarPickerCopy } from "@/lib/getCatalog";
import {
  generationKey,
  generationLabel,
  type Generation,
  type VehicleModel,
  type VehicleOption,
} from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

/* ==========================================================================
   The car picker — make → model → year, in that order.

   Three screens in one dialog rather than three dropdowns side by side. The
   steps are genuinely dependent (a model list means nothing until a make is
   chosen, a year range means nothing until a model is), and a dropdown row
   that greys out two of its three controls asks the customer to work that
   dependency out for themselves.

   Makes are picked by logo, models and years by name. Nothing is committed
   to the URL until the flow ends, so backing up a step costs nothing — the
   dialog holds a draft and calls `onApply` once.
   ========================================================================== */

/** A finished selection. `years` is a generation key ("1998-2002"), the same
    string that travels in ?years=…; null at either level means "any". */
export type CarPick = {
  make: string;
  model: string | null;
  years: string | null;
};

type Step = "make" | "model" | "year";

/** "Audi · A4 · 1998 – 2002", for the trigger and the applied-filter chip. */
export function carPickLabel(
  vehicles: VehicleOption[],
  pick: CarPick,
  present: string,
): string {
  const make = vehicles.find((v) => v.value === pick.make);
  const model = make?.models.find((m) => m.value === pick.model);
  const generation = model?.generations.find(
    (g) => generationKey(g) === pick.years,
  );
  return [
    make?.label ?? pick.make,
    model?.label ?? pick.model,
    generation && generationLabel(generation, present),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function CarPicker({
  vehicles,
  copy,
  value,
  onApply,
  onClose,
}: {
  vehicles: VehicleOption[];
  copy: CarPickerCopy;
  /** The selection already applied, so reopening lands on what's in the URL. */
  value: CarPick | null;
  /** Called once, with the finished selection or null to clear it. */
  onApply: (pick: CarPick | null) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("make");
  const [makeValue, setMakeValue] = useState(value?.make ?? "");
  const [modelValue, setModelValue] = useState(value?.model ?? "");
  const [query, setQuery] = useState("");

  const make = vehicles.find((v) => v.value === makeValue) ?? null;
  const model = make?.models.find((m) => m.value === modelValue) ?? null;

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (step === "make") searchRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const matches = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) =>
        v.label.toUpperCase().includes(q) || v.value.toUpperCase().includes(q),
    );
  }, [vehicles, query]);

  const commit = (pick: CarPick) => {
    onApply(pick);
    onClose();
  };

  // A make with no models on file, or a model with no generations, has
  // nothing to ask about — it applies straight away instead of showing an
  // empty screen with one "all" row on it.
  const chooseMake = (v: VehicleOption) => {
    setMakeValue(v.value);
    setModelValue("");
    if (v.models.length === 0) commit({ make: v.value, model: null, years: null });
    else setStep("model");
  };

  const chooseModel = (m: VehicleModel) => {
    setModelValue(m.value);
    if (m.generations.length === 0)
      commit({ make: makeValue, model: m.value, years: null });
    else setStep("year");
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-base/85 p-0 backdrop-blur-sm md:items-center md:p-6"
      style={{ animation: "rise .3s var(--ease-smooth) both" }}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-graphite md:max-w-3xl md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Header: title, path, and the search field on step one ---- */}
        <div className="shrink-0 bg-graphite px-5 pb-4 pt-4 md:px-7 md:pt-6">
          {/* Grab handle — the affordance that says "this dismisses". */}
          <div
            aria-hidden
            className="mx-auto mb-4 h-1 w-10 rounded-full bg-steel md:hidden"
          />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold md:text-2xl">
                {copy.title}
              </h2>
              <Path
                copy={copy}
                step={step}
                make={make}
                model={model}
                onStep={setStep}
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {value && (
                <button
                  onClick={() => {
                    onApply(null);
                    onClose();
                  }}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-mute transition-colors hover:text-turbo"
                >
                  {copy.change}
                </button>
              )}
              <CloseButton onClick={onClose} label={copy.back} />
            </div>
          </div>

          {step === "make" && (
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className={cn(INPUT, "mt-4 py-2.5 text-sm")}
            />
          )}
        </div>

        {/* ---- Body ------------------------------------------------------ */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 md:px-7 md:pb-7">
          {step === "make" && (
            <MakeGrid
              vehicles={matches}
              selected={makeValue}
              emptyLabel={copy.noMakes}
              onPick={chooseMake}
            />
          )}

          {step === "model" && make && (
            <RowList>
              <Row
                label={copy.allModels}
                onClick={() =>
                  commit({ make: make.value, model: null, years: null })
                }
              />
              {make.models.map((m) => (
                <Row
                  key={m.value}
                  label={m.label}
                  meta={generationSummary(m.generations, copy.present)}
                  selected={m.value === modelValue}
                  onClick={() => chooseModel(m)}
                />
              ))}
              {make.models.length === 0 && <Note>{copy.noModels}</Note>}
            </RowList>
          )}

          {step === "year" && make && model && (
            <RowList>
              <Row
                label={copy.allYears}
                onClick={() =>
                  commit({ make: make.value, model: model.value, years: null })
                }
              />
              {model.generations.map((g) => {
                const key = generationKey(g);
                return (
                  <Row
                    key={key}
                    label={generationLabel(g, copy.present)}
                    selected={key === value?.years && model.value === value.model}
                    onClick={() =>
                      commit({
                        make: make.value,
                        model: model.value,
                        years: key,
                      })
                    }
                  />
                );
              })}
            </RowList>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** "1998 – 2002 · 4 generations" — the second line on a model row. */
function generationSummary(generations: Generation[], present: string): string {
  if (generations.length === 0) return "";
  const first = generations[0];
  const last = generations[generations.length - 1];
  return generationLabel(
    { yearFrom: first.yearFrom, yearTo: last.yearTo, label: "" },
    present,
  );
}

/**
 * The path through the three steps, as pills you can tap to go back. It
 * doubles as the back control, which is why there is no separate back
 * button: "Audi" is a more useful thing to press than "back".
 */
function Path({
  copy,
  step,
  make,
  model,
  onStep,
}: {
  copy: CarPickerCopy;
  step: Step;
  make: VehicleOption | null;
  model: VehicleModel | null;
  onStep: (s: Step) => void;
}) {
  const crumbs: { key: Step; label: string; shown: boolean }[] = [
    { key: "make", label: make?.label ?? copy.stepMake, shown: true },
    {
      key: "model",
      label: model?.label ?? copy.stepModel,
      shown: Boolean(make),
    },
    { key: "year", label: copy.stepYear, shown: Boolean(model) },
  ];

  return (
    <nav className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-1 text-[0.8125rem]">
      {crumbs
        .filter((c) => c.shown)
        .map((c, i) => (
          <span key={c.key} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className="text-ink-mute">
                ·
              </span>
            )}
            <button
              onClick={() => onStep(c.key)}
              aria-current={step === c.key ? "step" : undefined}
              className={cn(
                "rounded-full px-2 py-0.5 font-semibold transition-colors",
                step === c.key
                  ? "text-turbo"
                  : "text-ink-mute hover:bg-carbon hover:text-ink",
              )}
            >
              {c.label}
            </button>
          </span>
        ))}
    </nav>
  );
}

function MakeGrid({
  vehicles,
  selected,
  emptyLabel,
  onPick,
}: {
  vehicles: VehicleOption[];
  selected: string;
  emptyLabel: string;
  onPick: (v: VehicleOption) => void;
}) {
  if (vehicles.length === 0) return <Note>{emptyLabel}</Note>;

  return (
    <div className="grid grid-cols-3 gap-2 pt-1 sm:grid-cols-4 md:grid-cols-5">
      {vehicles.map((v) => (
        <button
          key={v.value}
          onClick={() => onPick(v)}
          aria-pressed={v.value === selected}
          className={cn(
            "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-2.5",
            "transition-colors duration-200",
            v.value === selected ? "bg-steel" : "bg-carbon hover:bg-steel",
          )}
        >
          {/* The logos are printed artwork on white — dropping them straight
              onto the dark tile would lose every dark wordmark on the sheet
              (Chrysler, Lincoln, Maserati). They sit on a light plate
              instead, the same nesting the product tiles use for images. */}
          <span className="flex h-14 w-full items-center justify-center rounded-xl bg-white px-2.5">
            {v.logo ? (
              <img
                src={v.logo}
                alt=""
                loading="lazy"
                className="max-h-9 max-w-full object-contain"
              />
            ) : (
              <span className="font-display text-[0.8125rem] font-bold leading-tight text-base">
                {v.label}
              </span>
            )}
          </span>
          <span className="line-clamp-2 text-[0.75rem] font-semibold leading-tight text-ink-soft transition-colors group-hover:text-ink">
            {v.label}
          </span>
          <Corner active={v.value === selected} />
        </button>
      ))}
    </div>
  );
}

/** The orange corner flag from the make sheet these logos came off. */
function Corner({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 h-5 w-5 bg-turbo transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-70",
      )}
      style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
    />
  );
}

function RowList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5 pt-1">{children}</div>;
}

function Row({
  label,
  meta,
  selected = false,
  onClick,
}: {
  label: string;
  meta?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center justify-between gap-3 overflow-hidden",
        "rounded-xl px-4 py-3 text-left transition-colors duration-200",
        selected ? "bg-steel" : "bg-carbon hover:bg-steel",
      )}
    >
      <span className="text-[0.9375rem] font-semibold text-ink">{label}</span>
      {meta && (
        <span className="tnum shrink-0 text-[0.8125rem] text-ink-mute">
          {meta}
        </span>
      )}
      <Corner active={selected} />
    </button>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 py-8 text-center text-sm text-ink-mute">{children}</p>
  );
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon text-ink-mute transition-colors hover:bg-steel hover:text-ink"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </button>
  );
}
