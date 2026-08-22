/* ------------------------------------------------------------------ *
 * The "Book a call" notification email.
 *
 * Hand-written table markup with every style inline — Gmail strips <style>
 * from the head, so a stylesheet would silently drop the whole design.
 *
 * House rules carried over from the site: no hairlines and no outlines.
 * Separation is the surface ramp (base #050505 → graphite #111111 →
 * carbon #1a1a1a) plus one 1px inset top highlight per panel.
 * ------------------------------------------------------------------ */

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

/** Shown in place of an optional field the visitor left blank. */
const EMPTY = "—";

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/**
 * Everything below is interpolated into HTML, and all of it is typed by a
 * stranger on the internet. Escape it.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Blank optional fields read as a dash rather than leaving a gap. */
function orDash(value: string): string {
  return value.trim() ? esc(value.trim()) : EMPTY;
}

const label = (text: string) =>
  `<p style="margin:0 0 5px;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#6f6a67">${text}</p>`;

const value = (text: string) =>
  `<p style="margin:0;font-family:${FONT};font-size:16px;color:#fafafa;word-break:break-word">${text}</p>`;

/** One stacked label/value pair, laid out like the form's own fields. */
const row = (name: string, text: string, last = false) => `
              <tr>
                <td style="padding-bottom:${last ? 0 : 20}px">
                  ${label(name)}
                  ${value(text)}
                </td>
              </tr>`;

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
  const phone = esc(req.phone.trim());
  // tel: wants digits and a leading +, nothing else.
  const telHref = esc(req.phone.replace(/[^\d+]/g, ""));
  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tbilisi",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!-- Stop Outlook.com / Apple Mail re-inverting an already-dark design. -->
<meta name="color-scheme" content="dark only">
<meta name="supported-color-schemes" content="dark only">
<title>${esc(bookingSubject(req))}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#a3a3a3">

<!-- Inbox preview line, hidden in the body itself. -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#050505">${name} · ${phone} · ${esc(req.topic.trim())}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050505" style="background-color:#050505">
  <tr>
    <td align="center" style="padding:32px 16px 44px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">

        <!-- Wordmark -->
        <tr>
          <td style="padding:0 8px 22px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:0.14em;color:#fafafa">GMS<span style="color:#ff4a2b">TURBO</span></td>
                <td align="right" style="font-family:${FONT};font-size:12px;color:#6f6a67">${esc(submittedAt)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main panel -->
        <tr>
          <td bgcolor="#111111" style="background-color:#111111;border-radius:24px;overflow:hidden">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

              <!-- The inset top highlight the site's cards use, as a 1px
                   row — the only way to get it without a border. -->
              <tr>
                <td bgcolor="#1e1e1e" height="1" style="background-color:#1e1e1e;height:1px;line-height:1px;font-size:0">&nbsp;</td>
              </tr>

              <tr>
                <td style="padding:34px 34px 12px">
                  <p style="margin:0;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#6f6a67">Callback request</p>
                  <h1 style="margin:10px 0 0;font-family:${FONT};font-size:32px;line-height:1.1;font-weight:600;letter-spacing:-0.02em;color:#fafafa">${name}</h1>
                  <p style="margin:12px 0 0;font-family:${FONT};font-size:15px;font-weight:600;color:#ff4a2b">${esc(req.topic.trim())}</p>
                </td>
              </tr>

              <!-- Call button -->
              <tr>
                <td style="padding:26px 34px 4px">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#d93411" style="background-color:#d93411;border-radius:999px">
                        <a href="tel:${telHref}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">Call ${phone}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Details. Spacing separates them, not rules. -->
              <tr>
                <td style="padding:30px 34px 0">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${row("Email", orDash(req.email))}${row("Preferred time", orDash(req.preferred))}${row("Site language", esc(req.locale), true)}
                  </table>
                </td>
              </tr>

              <!-- Message, on the next surface up so it reads as the
                   customer's own words. -->
              <tr>
                <td style="padding:26px 22px 22px">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1a1a1a" style="background-color:#1a1a1a;border-radius:18px">
                    <tr>
                      <td style="padding:22px 24px">
                        ${label("Message")}
                        <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:#fafafa;white-space:pre-wrap;word-break:break-word">${orDash(req.message)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 12px 0">
            <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:#6f6a67">Sent from the &ldquo;Book a call&rdquo; form on gmsturbo.ge.${req.email.trim() ? ` Replying to this email answers ${name} directly.` : ""}</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
