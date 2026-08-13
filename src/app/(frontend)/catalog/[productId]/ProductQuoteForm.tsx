"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/context";
import { stockLabel } from "@/lib/i18n/dictionary";
import { Button, Field, INPUT } from "@/components/Primitives";
import { cn } from "@/lib/utils";

export function ProductQuoteForm({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);

  return (
    <section id="quote" className="shell">
      <div className="grid gap-12 rounded-[2rem] bg-graphite px-6 py-14 md:px-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-16">
        <div>
          <p className="eyebrow">{t("product.quoteKicker")}</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)]">
            {t("product.quoteTitle1")}{" "}
            <span className="text-turbo">{t("product.quoteTitle2")}</span>
          </h2>
          <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            {t("product.quoteBlurb")}
          </p>

          <dl className="mt-10 space-y-4">
            <Row
              label={t("product.unit")}
              value={`${product.name} · ${product.code}`}
            />
            <Row
              label={t("product.listPrice")}
              value={`${product.price.toLocaleString()} GEL`}
            />
            <Row
              label={t("product.stock")}
              value={stockLabel(product.stock, lang)}
            />
            <Row
              label={t("product.leadTime")}
              value={
                product.stock === "MADE TO ORDER"
                  ? t("product.leadMade")
                  : t("product.leadReady")
              }
            />
          </dl>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
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
          <Field
            label={t("product.targetPower")}
            name="hp"
            type="number"
          />
          <Field
            label={t("product.fuel")}
            name="fuel"
            placeholder={t("product.fuelPlaceholder")}
          />
          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-semibold text-ink"
            >
              {t("product.notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className={cn(INPUT, "resize-none")}
              placeholder={t("product.notesPlaceholder")}
            />
          </div>
          <Button type="submit" disabled={sent} className="sm:col-span-2">
            {sent ? t("product.requestSent") : t("product.sendRequest")}
          </Button>
        </form>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="text-sm text-ink-mute">{label}</dt>
      <dd className="tnum text-right text-[0.9375rem] font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}
