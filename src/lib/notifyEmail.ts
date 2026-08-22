/**
 * Shared plumbing for the two form endpoints (/api/booking, /api/quote).
 *
 * The Resend key lives on the server, so there is no public key to lock down
 * with an origin allowlist: the call to Resend comes from our own process.
 */
import { Resend } from "resend";

// `||`, not `??`: an env var declared but left blank is "" rather than
// undefined, and an empty From is rejected by Resend.
export const TO =
  process.env.BOOKING_TO_EMAIL?.trim() || "gmsturbogeorgia@gmail.com";
// Resend's shared sender, usable before a domain is verified — but it only
// delivers to the address that owns the Resend account.
const FROM =
  process.env.BOOKING_FROM_EMAIL?.trim() || "onboarding@resend.dev";

/** Long enough for any real answer, short enough that nobody can post a novel. */
const MAX_FIELD = 2000;

/** Coerce one untrusted JSON value into a bounded string. */
export function clean(input: unknown): string {
  return typeof input === "string" ? input.trim().slice(0, MAX_FIELD) : "";
}

/** Only two locales exist; anything else is someone poking at the endpoint. */
export function cleanLocale(input: unknown): string {
  return clean(input).toUpperCase() === "KA" ? "KA" : "EN";
}

export type Notification = {
  subject: string;
  html: string;
  text: string;
  /** The visitor's address, so hitting reply answers them. */
  replyTo?: string;
};

export type SendResult = { ok: true; id?: string } | { ok: false };

export async function sendNotification(
  notification: Notification,
): Promise<SendResult> {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set — cannot send form emails.");
    return { ok: false };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    ...(notification.replyTo ? { replyTo: notification.replyTo } : {}),
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
  });

  // Resend reports failures in the payload rather than throwing.
  if (error) {
    console.error("Resend rejected the email:", error);
    return { ok: false };
  }

  return { ok: true, id: data?.id };
}
