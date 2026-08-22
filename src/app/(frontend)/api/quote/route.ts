/**
 * POST /api/quote — the "Request a quote" form on a product page.
 *
 * The client sends only the product id. Name, price, stock and lead time are
 * re-read from the DB here: a quote priced from numbers the browser supplied
 * would be a quote the visitor got to write.
 */
import { NextResponse } from "next/server";
import { getProductById } from "@/lib/getProducts";
import {
  quoteHtml,
  quoteSubject,
  quoteText,
  type QuoteRequest,
} from "@/emails/quoteRequest";
import { clean, cleanLocale, sendNotification } from "@/lib/notifyEmail";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://gmsturbo.ge";

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

  const name = clean(payload.name);
  const phone = clean(payload.phone);
  const productId = clean(payload.productId);
  const locale = cleanLocale(payload.locale);

  if (!name || !phone || !productId) {
    return NextResponse.json(
      { ok: false, error: "Name, phone and product are required." },
      { status: 400 },
    );
  }

  // Quote in the language the visitor was reading, so the unit name in the
  // email matches the page they submitted from.
  const product = await getProductById(productId, locale === "KA" ? "ka" : "en");
  if (!product) {
    return NextResponse.json(
      { ok: false, error: "Unknown product." },
      { status: 400 },
    );
  }

  const quote: QuoteRequest = {
    name,
    phone,
    email: clean(payload.email),
    vehicle: clean(payload.vehicle),
    hp: clean(payload.hp),
    fuel: clean(payload.fuel),
    notes: clean(payload.notes),
    locale,
    product: {
      name: product.name,
      code: product.code,
      price: product.price ?? null,
      stock: product.stock,
      // Same rule the form shows the visitor.
      leadTime:
        product.stock === "MADE TO ORDER" ? "3–4 weeks" : "2–5 days",
      url: `${SITE_URL}/${locale.toLowerCase()}/catalog/${product.id}`,
    },
  };

  const result = await sendNotification({
    subject: quoteSubject(quote),
    html: quoteHtml(quote),
    text: quoteText(quote),
    replyTo: quote.email || undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not send the request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
