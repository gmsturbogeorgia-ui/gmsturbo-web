/**
 * The "Book a call" notification — the site-wide callback modal.
 * Chrome and house rules live in ./layout.
 */
import {
  EMPTY,
  callButton,
  detailsSection,
  emailShell,
  esc,
  messagePanel,
  orDash,
} from "./layout";

export type BookingRequest = {
  name: string;
  phone: string;
  /** Empty when the visitor skipped the field. */
  email: string;
  topic: string;
  preferred: string;
  message: string;
  /** "EN" | "KA" — which language to call back in. */
  locale: string;
};

export function bookingSubject(req: BookingRequest): string {
  return `Callback: ${req.name.trim()} — ${req.topic.trim()}`;
}

/** Plain-text alternative, for clients that refuse HTML. */
export function bookingText(req: BookingRequest): string {
  return [
    "CALLBACK REQUEST",
    "",
    `Name:           ${req.name.trim()}`,
    `Phone:          ${req.phone.trim()}`,
    `Email:          ${req.email.trim() || EMPTY}`,
    `Topic:          ${req.topic.trim()}`,
    `Preferred time: ${req.preferred.trim() || EMPTY}`,
    `Site language:  ${req.locale}`,
    "",
    "Message:",
    req.message.trim() || EMPTY,
    "",
    "Sent from the Book a call form on gmsturbo.ge.",
  ].join("\n");
}

export function bookingHtml(req: BookingRequest): string {
  const name = esc(req.name.trim());

  return emailShell({
    subject: bookingSubject(req),
    preheader: `${req.name.trim()} · ${req.phone.trim()} · ${req.topic.trim()}`,
    eyebrow: "Callback request",
    heading: name,
    accent: esc(req.topic.trim()),
    body:
      callButton(req.phone) +
      detailsSection([
        ["Email", orDash(req.email)],
        ["Preferred time", orDash(req.preferred)],
        ["Site language", esc(req.locale)],
      ]) +
      messagePanel("Message", req.message),
    replyNote: req.email.trim()
      ? ` Replying to this email answers ${name} directly.`
      : "",
  });
}
