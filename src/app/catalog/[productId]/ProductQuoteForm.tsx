"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";

export function ProductQuoteForm({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);
  return (
    <section id="quote" className="border-b border-border bg-graphite">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            {t("product.quoteKicker")}
          </p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-6xl">
            {t("product.quoteTitle1")}
            <br />
            <span className="text-turbo">{t("product.quoteTitle2")}</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("product.quoteBlurb")}
          </p>

          <div className="mt-10 space-y-5 border-t border-border pt-6">
            <Row label={t("product.unit")} value={`${product.name} · ${product.code}`} />
            <Row
              label={t("product.listPrice")}
              value={`${product.price.toLocaleString()} GEL`}
            />
            <Row label={t("product.stock")} value={stockLabel(product.stock, lang)} />
            <Row
              label={t("product.leadTime")}
              value={
                product.stock === "MADE TO ORDER"
                  ? t("product.leadMade")
                  : t("product.leadReady")
              }
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2"
        >
          <Field label={t("product.fullName")} name="name" required />
          <Field label={t("product.phone")} name="phone" type="tel" required />
          <Field
            label={t("product.email")}
            name="email"
            type="email"
            required
            className="sm:col-span-2"
          />
          <Field
            label={t("product.vehicleField")}
            name="vehicle"
            required
            className="sm:col-span-2"
          />
          <Field label={t("product.targetPower")} name="hp" type="number" />
          <Field
            label={t("product.fuel")}
            name="fuel"
            placeholder={t("product.fuelPlaceholder")}
          />
          <div className="bg-background p-5 sm:col-span-2">
            <label className="block font-mono text-[10px] tracking-widest text-muted-foreground">
              {t("product.notes")}
            </label>
            <textarea
              name="notes"
              rows={4}
              className="mt-2 w-full resize-none border-0 bg-transparent font-sans text-sm text-foreground focus:outline-none"
              placeholder={t("product.notesPlaceholder")}
            />
          </div>
          <div className="bg-background p-5 sm:col-span-2">
            <button
              type="submit"
              disabled={sent}
              className="w-full bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember disabled:bg-steel disabled:text-muted-foreground"
            >
              {sent ? t("product.requestSent") : t("product.sendRequest")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-lg tracking-wide">{value}</span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-background p-5 ${className}`}>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="ml-1 text-turbo">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border-0 bg-transparent font-sans text-base text-foreground focus:outline-none"
      />
    </div>
  );
}
