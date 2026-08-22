/**
 * POST /api/booking — the site-wide "Book a call" modal.
 *
 * Sits under (frontend) so it stays with the site rather than with Payload,
 * whose catch-all lives at /api/[...slug] — a static segment wins over it,
 * the same way /api/seed already does.
 */
import { NextResponse } from "next/server";
import {
  bookingHtml,
  bookingSubject,
  bookingText,
  type BookingRequest,
} from "@/emails/bookingRequest";
import { clean, cleanLocale, sendNotification } from "@/lib/notifyEmail";

export async function POST(request: Request) {
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
    locale: cleanLocale(payload.locale),
  };

  if (!booking.name || !booking.phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required." },
      { status: 400 },
    );
  }

  const result = await sendNotification({
    subject: bookingSubject(booking),
    html: bookingHtml(booking),
    text: bookingText(booking),
    replyTo: booking.email || undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not send the request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
