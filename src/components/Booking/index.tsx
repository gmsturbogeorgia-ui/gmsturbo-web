"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLanguage } from "@/lib/i18n/context";

/* ------------------------------------------------------------------ *
 * Site-wide "Book a Call" modal.
 *
 * Mounted once (via <BookingProvider> in the root layout) so any client
 * component can trigger it with `useBooking().open()`. There is no backend
 * yet — submitting shows a confirmation state and clears on close.
 * ------------------------------------------------------------------ */

type BookingContextValue = {
  open: () => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <BookingModal onClose={close} />}
    </BookingContext.Provider>
  );
}

/** Primary call-to-action button that opens the booking modal. */
export function BookCallButton({
  variant = "solid",
  className = "",
}: {
  variant?: "solid" | "outline";
  className?: string;
}) {
  const { open } = useBooking();
  const { t } = useLanguage();
  const base =
    "inline-flex items-center justify-center font-heading text-sm tracking-[0.2em] transition-colors";
  const styles =
    variant === "solid"
      ? "bg-turbo px-7 py-4 text-white hover:bg-ember"
      : "border border-border px-7 py-4 text-foreground hover:border-turbo hover:text-turbo";
  return (
    <button
      type="button"
      onClick={open}
      className={`${base} ${styles} ${className}`}
    >
      {t("booking.cta")}
    </button>
  );
}

function BookingModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("booking.title")}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-border bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-5 sm:px-8">
          <div>
            <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
              {t("booking.kicker")}
            </p>
            <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
              {t("booking.title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("booking.close")}
            className="ml-4 shrink-0 border border-border p-2 text-muted-foreground transition-colors hover:border-turbo hover:text-turbo"
          >
            <span className="block h-4 w-4 leading-none">✕</span>
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <p className="font-mono text-[10px] tracking-[0.25em] text-turbo">
              {t("booking.successKicker")}
            </p>
            <h3 className="mt-4 font-display text-4xl tracking-wide">
              {t("booking.successTitle")}
            </h3>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("booking.successBody")}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
            >
              {t("booking.done")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <p className="px-6 pt-6 text-sm leading-relaxed text-muted-foreground sm:px-8">
              {t("booking.blurb")}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2">
              <Field label={t("booking.name")} name="name" required />
              <Field
                label={t("booking.phone")}
                name="phone"
                type="tel"
                required
              />
              <Field
                label={t("booking.email")}
                name="email"
                type="email"
                className="sm:col-span-2"
              />
              <SelectField
                label={t("booking.topic")}
                name="topic"
                className="sm:col-span-2"
                options={[
                  t("booking.topicGeneral"),
                  t("booking.topicRebuild"),
                  t("booking.topicHybrid"),
                  t("booking.topicCompetition"),
                  t("booking.topicViewing"),
                ]}
              />
              <Field
                label={t("booking.preferred")}
                name="preferred"
                placeholder={t("booking.preferredPlaceholder")}
                className="sm:col-span-2"
              />
              <div className="bg-background p-5 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block font-mono text-[10px] tracking-widest text-muted-foreground"
                >
                  {t("booking.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="mt-2 w-full resize-none border-0 bg-transparent font-sans text-sm text-foreground focus:outline-none"
                  placeholder={t("booking.messagePlaceholder")}
                />
              </div>
            </div>
            <div className="border-t border-border p-5 sm:px-8">
              <button
                type="submit"
                className="w-full bg-turbo px-7 py-4 font-heading text-sm tracking-[0.2em] text-white transition-colors hover:bg-ember"
              >
                {t("booking.submit")}
              </button>
              <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-muted-foreground">
                {t("booking.privacy")}
              </p>
            </div>
          </form>
        )}
      </div>
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

function SelectField({
  label,
  name,
  options,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <div className={`bg-background p-5 ${className}`}>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={options[0]}
        className="mt-2 w-full border-0 bg-transparent font-sans text-base text-foreground focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background text-foreground">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
