/**
 * The stylesheet /sitemap.xml points at, so that opening it in a browser shows
 * a readable table instead of whatever that browser does with bare XML.
 *
 * Served from a route rather than dropped in public/ for one reason: the
 * content type. A browser only applies an `<?xml-stylesheet?>` whose response
 * says `text/xsl` (or another XML/XSLT type), and a static host is free to
 * serve an unknown extension like .xsl as application/octet-stream — at which
 * point the transform is silently skipped and the page falls back to the raw
 * tree. Here the header is not a guess.
 *
 * XSLT 1.0 is what browsers implement, so: no `<xsl:for-each-group>`, no
 * regex, and every sitemap element has to be addressed through the `s:` prefix
 * because they are in the sitemaps namespace rather than no namespace at all.
 */
const STYLESHEET = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <!-- This page exists for the one person who typed the URL. It is not
             a page of the site, and nothing should ever rank for it. -->
        <meta name="robots" content="noindex"/>
        <title>Sitemap · GMS Turbo Georgia</title>
        <style>
          :root {
            color-scheme: dark;
            --paper: #131211;
            --panel: #1b1a18;
            --ink: #f4f1ec;
            --ink-soft: #a8a29a;
            --ink-faint: #6f6a63;
            --accent: #ff5b1f;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 4rem 1.5rem 6rem;
            background: var(--paper);
            color: var(--ink-soft);
            font-family: "Instrument Sans", -apple-system, BlinkMacSystemFont,
              "Segoe UI", system-ui, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { max-width: 1080px; margin: 0 auto; }
          .kicker {
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--accent);
            margin: 0 0 0.75rem;
          }
          h1 {
            margin: 0 0 0.5rem;
            font-size: clamp(1.75rem, 4vw, 2.5rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            color: var(--ink);
          }
          .lead { margin: 0 0 2.5rem; max-width: 60ch; color: var(--ink-faint); }
          .lead strong { color: var(--ink-soft); font-weight: 600; }
          /* The panel carries the inset top highlight the site's cards use,
             so this page reads as part of the same surface family. */
          .panel {
            background: var(--panel);
            border-radius: 14px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
            overflow-x: auto;
          }
          table { width: 100%; border-collapse: collapse; min-width: 640px; }
          th {
            text-align: left;
            padding: 1rem 1.25rem;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--ink-faint);
            white-space: nowrap;
          }
          td { padding: 0.85rem 1.25rem; vertical-align: top; }
          /* Rows are separated by tint, not rules — the site uses no borders. */
          tbody tr:nth-child(odd) { background: rgba(255, 255, 255, 0.022); }
          td.url { width: 55%; word-break: break-all; }
          a { color: var(--ink); text-decoration: none; }
          a:hover { color: var(--accent); }
          .lang {
            display: inline-block;
            min-width: 2.25rem;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--ink-faint);
          }
          td.meta { color: var(--ink-faint); white-space: nowrap; }
          td.num { text-align: right; font-variant-numeric: tabular-nums; }
          @media (max-width: 640px) {
            body { padding: 2.5rem 1rem 4rem; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="kicker">XML Sitemap</p>
          <h1>GMS Turbo Georgia</h1>
          <p class="lead">
            <strong><xsl:value-of select="count(s:urlset/s:url)"/> URLs</strong>
            submitted to search engines. This page is a stylesheet applied for
            readability — crawlers read the underlying XML and ignore it.
          </p>

          <div class="panel">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Lang</th>
                  <th>Last modified</th>
                  <th>Frequency</th>
                  <th class="num">Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="url">
                      <a target="_blank" rel="noopener">
                        <xsl:attribute name="href">
                          <xsl:value-of select="s:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td>
                      <!-- The locale is the first path segment. XSLT 1.0 has
                           no split(), so it is cut from a known offset: the
                           origin is the same for every row. -->
                      <span class="lang">
                        <xsl:value-of
                          select="substring(substring-after(substring-after(s:loc, '//'), '/'), 1, 2)"/>
                      </span>
                    </td>
                    <td class="meta">
                      <xsl:value-of select="substring(s:lastmod, 1, 10)"/>
                      <xsl:text> </xsl:text>
                      <xsl:value-of select="substring(s:lastmod, 12, 5)"/>
                    </td>
                    <td class="meta"><xsl:value-of select="s:changefreq"/></td>
                    <td class="num"><xsl:value-of select="s:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export function GET() {
  return new Response(STYLESHEET, {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
