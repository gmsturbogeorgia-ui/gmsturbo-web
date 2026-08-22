/**
 * POST /api/booking — the "Book a call" form.
 *
 * Sends the request to the workshop inbox through Resend. The API key lives
 * here rather than in the browser, so there is no public key to lock down
 * with an origin allowlist: the call to Resend comes from our own server.
 *
 * Sits under (frontend) so it stays with the site rather than with Payload,
 * whose catch-all lives at /api/[...slug] — a static segment wins over it,
 * the same way /api/seed already does.
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  bookingHtml,
  bookingSubject,
  bookingText,
  type BookingRequest,
} from "@/emails/bookingRequest";

// `||`, not `??`: an env var declared but left blank is "" rather than
// undefined, and an empty From is rejected by Resend.
const TO = process.env.BOOKING_TO_EMAIL?.trim() || "gmsturbogeorgia@gmail.com";
// Resend's shared sender, usable before a domain is verified — but it only
// delivers to the address that owns the Resend account.
const FROM = process.env.BOOKING_FROM_EMAIL?.trim() || "onboarding@resend.dev";

/** Long enough for any real answer, short enough that nobody can post a novel. */
const MAX_FIELD = 2000;

function clean(input: unknown): string {
  return typeof input === "string" ? input.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set — cannot send booking requests.");
    return NextResponse.json(
      { ok: false, error: "Email is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const payload = (body ?? {}) as Record<string, unknown>;

  // Bots fill in every field they find; people never see this one.
  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const booking: BookingRequest = {
    name: clean(payload.name),
    phone: clean(payload.phone),
    email: clean(payload.email),
    topic: clean(payload.topic),
    preferred: clean(payload.preferred),
    message: clean(payload.message),
    locale: clean(payload.locale).toUpperCase() === "KA" ? "KA" : "EN",
  };

  if (!booking.name || !booking.phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required." },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    // So hitting reply in Gmail answers the customer, not ourselves.
    ...(booking.email ? { replyTo: booking.email } : {}),
    subject: bookingSubject(booking),
    html: bookingHtml(booking),
    text: bookingText(booking),
  });

  // Resend reports failures in the payload rather than throwing.
  if (error) {
    console.error("Resend rejected the booking email:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send the request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
