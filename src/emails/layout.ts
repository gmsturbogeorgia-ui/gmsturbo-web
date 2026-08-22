/* ------------------------------------------------------------------ *
 * Shared chrome for the notification emails.
 *
 * Hand-written table markup with every style inline — Gmail strips <style>
 * from the head, so a stylesheet would silently drop the whole design.
 *
 * House rules carried over from the site: no hairlines and no outlines.
 * Separation is the surface ramp (base #050505 → graphite #111111 →
 * carbon #1a1a1a) plus one 1px inset top highlight per panel.
 * ------------------------------------------------------------------ */

export const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** Shown in place of an optional field the visitor left blank. */
export const EMPTY = "-";

/**
 * Everything interpolated into these templates is typed by a stranger on
 * the internet. Escape it.
 */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Blank optional fields read as a dash rather than leaving a gap. */
export function orDash(value: string): string {
  return value.trim() ? esc(value.trim()) : EMPTY;
}

export const label = (text: string) =>
  `<p style="margin:0 0 5px;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#6f6a67">${text}</p>`;

const valueLine = (text: string) =>
  `<p style="margin:0;font-family:${FONT};font-size:16px;color:#fafafa;word-break:break-word">${text}</p>`;

/**
 * Stacked label/value pairs, laid out like the form's own fields. Spacing
 * separates them, not rules. Values must already be escaped.
 */
export function detailRows(items: [string, string][]): string {
  return items
    .map(
      ([name, text], i) => `
              <tr>
                <td style="padding-bottom:${i === items.length - 1 ? 0 : 20}px">
                  ${label(name)}
                  ${valueLine(text)}
                </td>
              </tr>`,
    )
    .join("");
}

/**
 * Label left, value right — the two-column spec list from the product page,
 * for facts that read as a table rather than as answers to a form.
 */
export function specRows(items: [string, string][]): string {
  return items
    .map(
      ([name, text], i) => `
                        <tr>
                          <td style="padding:${i === 0 ? 0 : 10}px 12px 0 0;font-family:${FONT};font-size:13px;color:#6f6a67">${name}</td>
                          <td align="right" style="padding:${i === 0 ? 0 : 10}px 0 0;font-family:${FONT};font-size:15px;font-weight:600;color:#fafafa">${text}</td>
                        </tr>`,
    )
    .join("");
}

/** The one solid action in the email: ring the customer back. */
export function callButton(phone: string): string {
  // tel: wants digits and a leading +, nothing else.
  const href = esc(phone.replace(/[^\d+]/g, ""));
  return `
              <tr>
                <td style="padding:26px 34px 4px">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td bgcolor="#d93411" style="background-color:#d93411;border-radius:999px">
                        <a href="tel:${href}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">Call ${esc(phone.trim())}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`;
}

/** A carbon panel — the next surface up, for content that isn't ours. */
export function panel(heading: string, bodyHtml: string): string {
  return `
              <tr>
                <td style="padding:26px 22px 0">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1a1a1a" style="background-color:#1a1a1a;border-radius:18px">
                    <tr>
                      <td style="padding:22px 24px">
                        ${label(heading)}
                        ${bodyHtml}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`;
}

/** Free text from the visitor, line breaks preserved. */
export function messagePanel(heading: string, text: string): string {
  return panel(
    heading,
    `<p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.6;color:#fafafa;white-space:pre-wrap;word-break:break-word">${orDash(text)}</p>`,
  );
}

/** Wraps the detail rows so callers don't repeat the table scaffolding. */
export function detailsSection(items: [string, string][]): string {
  return `
              <tr>
                <td style="padding:30px 34px 0">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows(items)}
                  </table>
                </td>
              </tr>`;
}

export type ShellOptions = {
  /** <title> and the hidden inbox preview line. */
  subject: string;
  preheader: string;
  /** Small uppercase label above the name. */
  eyebrow: string;
  /** The customer's name, already escaped. */
  heading: string;
  /** Red line under the name — the topic, or the unit being quoted. */
  accent: string;
  /** Everything between the header and the footer, as <tr> rows. */
  body: string;
  /** Appended to the footer when we have an address to reply to. */
  replyNote: string;
};

export function emailShell(opts: ShellOptions): string {
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
<title>${esc(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#a3a3a3">

<!-- Inbox preview line, hidden in the body itself. -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#050505">${esc(opts.preheader)}</div>

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
                  <p style="margin:0;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#6f6a67">${esc(opts.eyebrow)}</p>
                  <h1 style="margin:10px 0 0;font-family:${FONT};font-size:32px;line-height:1.1;font-weight:600;letter-spacing:-0.02em;color:#fafafa">${opts.heading}</h1>
                  <p style="margin:12px 0 0;font-family:${FONT};font-size:15px;font-weight:600;color:#ff4a2b">${opts.accent}</p>
                </td>
              </tr>
${opts.body}

              <!-- Bottom padding, since the last block sets none. -->
              <tr><td style="height:22px;line-height:22px;font-size:0">&nbsp;</td></tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 12px 0">
            <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:#6f6a67">Sent from gmsturbo.ge.${opts.replyNote}</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
