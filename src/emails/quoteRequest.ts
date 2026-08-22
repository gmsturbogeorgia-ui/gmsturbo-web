/**
 * The "Request a quote" notification — the form on a product page.
 *
 * Differs from the callback email in one way that matters: it carries the
 * unit being quoted, so the reply can be priced without opening the catalog.
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
  panel,
  specRows,
} from "./layout";

export type QuoteRequest = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  /** Target power in HP, as typed. Empty when skipped. */
  hp: string;
  fuel: string;
  notes: string;
  /** "EN" | "KA" — which language to call back in. */
  locale: string;
  /** The unit the visitor was looking at when they submitted. */
  product: {
    name: string;
    code: string;
    /** GEL, already a number on the server. */
    price: number;
    stock: string;
    leadTime: string;
    url: string;
  };
};

const priceLabel = (price: number) => `${price.toLocaleString("en-US")} GEL`;

export function quoteSubject(req: QuoteRequest): string {
  return `Quote: ${req.product.code} — ${req.name.trim()}`;
}

/** Plain-text alternative, for clients that refuse HTML. */
export function quoteText(req: QuoteRequest): string {
  return [
    "QUOTE REQUEST",
    "",
    `Unit:           ${req.product.name} (${req.product.code})`,
    `List price:     ${priceLabel(req.product.price)}`,
    `Stock:          ${req.product.stock}`,
    `Lead time:      ${req.product.leadTime}`,
    `Product page:   ${req.product.url}`,
    "",
    `Name:           ${req.name.trim()}`,
    `Phone:          ${req.phone.trim()}`,
    `Email:          ${req.email.trim() || EMPTY}`,
    `Vehicle:        ${req.vehicle.trim()}`,
    `Target power:   ${req.hp.trim() ? `${req.hp.trim()} HP` : EMPTY}`,
    `Fuel:           ${req.fuel.trim() || EMPTY}`,
    `Site language:  ${req.locale}`,
    "",
    "Notes:",
    req.notes.trim() || EMPTY,
    "",
    "Sent from the quote form on gmsturbo.ge.",
  ].join("\n");
}

export function quoteHtml(req: QuoteRequest): string {
  const name = esc(req.name.trim());
  const url = esc(req.product.url);

  // The unit sits above the customer's answers: it's what the reply has to
  // be priced against, and it's the one thing they didn't type themselves.
  const unit = panel(
    "Unit requested",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${specRows(
      [
        ["Unit", esc(req.product.name)],
        ["Code", esc(req.product.code)],
        ["List price", esc(priceLabel(req.product.price))],
        ["Stock", esc(req.product.stock)],
        ["Lead time", esc(req.product.leadTime)],
      ],
    )}
                        </table>
                        <p style="margin:16px 0 0"><a href="${url}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#ff4a2b;text-decoration:none">Open the product page</a></p>`,
  );

  return emailShell({
    subject: quoteSubject(req),
    preheader: `${req.name.trim()} · ${req.product.code} · ${req.vehicle.trim()}`,
    eyebrow: "Quote request",
    heading: name,
    accent: `${esc(req.product.name)} · ${esc(req.product.code)}`,
    body:
      callButton(req.phone) +
      unit +
      detailsSection([
        ["Email", orDash(req.email)],
        ["Vehicle", orDash(req.vehicle)],
        ["Target power", req.hp.trim() ? `${esc(req.hp.trim())} HP` : EMPTY],
        ["Fuel", orDash(req.fuel)],
        ["Site language", esc(req.locale)],
      ]) +
      messagePanel("Notes", req.notes),
    replyNote: req.email.trim()
      ? ` Replying to this email answers ${name} directly.`
      : "",
  });
}
