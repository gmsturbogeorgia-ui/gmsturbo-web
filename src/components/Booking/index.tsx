"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Button, Field, INPUT } from "@/components/Primitives";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Site-wide "Book a Call" modal.
 *
 * Mounted once (via <BookingProvider> in the root layout) so any client
 * component can trigger it with `useBooking().open()`. Submitting POSTs to
 * /api/booking, which sends the request to the workshop inbox via Resend,
 * then shows a confirmation state.
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
  variant = "primary",
  size = "lg",
  className,
}: {
  variant?: "primary" | "secondary" | "quiet";
  size?: "md" | "lg";
  className?: string;
}) {
  const { open } = useBooking();
  const { t } = useLanguage();
  return (
    <Button variant={variant} size={size} onClick={open} className={className}>
      {t("booking.cta")}
    </Button>
  );
}

/**
 * Louder variant of the same action, for the hero.
 *
 * The label and the icon badge trade places on hover: the badge slides from
 * the right end to the left and rotates 45deg, and the pill's logical padding
 * swaps sides so the label slides with it instead of being pushed. Both sides
 * of the swap are on the same 500ms curve, so it reads as one motion.
 *
 * Sizing is fixed (h-12, a 40px badge) because the two padding states have to
 * be mirror images for the label to hold still — that's why this doesn't go
 * through the shared size scale.
 */
export function BookCallPill({ className }: { className?: string }) {
  const { open } = useBooking();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "group relative inline-flex h-12 w-fit items-center overflow-hidden whitespace-nowrap rounded-full",
        "bg-carbon p-1 ps-6 pe-14 font-display text-[0.9375rem] font-semibold text-ink",
        "transition-[background-color,padding] duration-500 ease-smooth",
        "hover:bg-steel hover:ps-14 hover:pe-6",
        "motion-reduce:transition-none motion-reduce:hover:ps-6 motion-reduce:hover:pe-14",
        className,
      )}
    >
      <span className="relative z-10">{t("booking.cta")}</span>
      <span
        aria-hidden
        className={cn(
          "absolute end-1 flex h-10 w-10 items-center justify-center rounded-full",
          "bg-turbo-deep text-white transition-all duration-500 ease-smooth",
          "group-hover:end-[calc(100%-2.75rem)] group-hover:rotate-45",
          "motion-reduce:transition-none motion-reduce:group-hover:end-1 motion-reduce:group-hover:rotate-0",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </span>
    </button>
  );
}

function BookingModal({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLanguage();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !formRef.current) return;

    const data = new FormData(formRef.current);
    const field = (key: string) =>
      ((data.get(key) as string | null) ?? "").trim();

    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: field("name"),
          phone: field("phone"),
          email: field("email"),
          topic: field("topic"),
          preferred: field("preferred"),
          message: field("message"),
          company: field("company"), // honeypot
          locale: lang,
        }),
      });
      if (!res.ok) {
        throw new Error(`/api/booking responded ${res.status}`);
      }
      setSent(true);
    } catch (err) {
      console.error("Booking request failed to send", err);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  // Close on Escape, lock background scroll, and move focus into the dialog
  // so keyboard users aren't left behind on the page underneath.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-base/80 backdrop-blur-sm sm:items-center sm:p-6"
      style={{ animation: "rise .3s var(--ease-smooth) both" }}
      role="dialog"
      aria-modal="true"
      aria-label={t("booking.title")}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-base shadow-lift focus:outline-none sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-base/95 px-6 py-5 backdrop-blur sm:px-8">
          <div>
            <p className="eyebrow">{t("booking.kicker")}</p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold">
              {t("booking.title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("booking.close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carbon text-ink-mute transition-colors hover:bg-steel hover:text-ink"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-turbo-wash">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-turbo"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12.5l5.5 5.5L20 6.5" />
              </svg>
            </div>
            <h3 className="mt-6 font-display text-3xl font-semibold">
              {t("booking.successTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
              {t("booking.successBody")}
            </p>
            <Button onClick={onClose} className="mt-8">
              {t("booking.done")}
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="px-6 py-6 sm:px-8">
            {/* Honeypot. Off-screen rather than display:none, which some
                bots know to skip. Real people never reach it: no tab stop,
                hidden from screen readers, and autofill is off. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
              {t("booking.blurb")}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  {t("booking.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className={cn(INPUT, "resize-none")}
                  placeholder={t("booking.messagePlaceholder")}
                />
              </div>
            </div>

            <Button type="submit" className="mt-8 w-full" disabled={sending}>
              {sending ? t("booking.sending") : t("booking.submit")}
            </Button>
            {error && (
              <p className="mt-4 text-center text-sm text-turbo">
                {t("booking.error")}
              </p>
            )}
            <p className="mt-4 text-center text-xs text-ink-mute">
              {t("booking.privacy")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  className,
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-semibold text-ink"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={options[0]}
        className={cn(INPUT, "appearance-none bg-carbon pr-10")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%236f6a67' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
          backgroundSize: "0.75rem",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
