/**
 * Turns whatever an editor pastes into Contact → Find us → Map location into
 * the "lat,lng" pair the Leaflet map needs.
 *
 * The map is Leaflet + OpenStreetMap tiles, which has no geocoder — a typed
 * street address can't be placed on it. So the field stores coordinates, and
 * everything here exists to spare the editor from digging them out of a
 * Google Maps URL by hand. Handled forms:
 *
 *   https://maps.app.goo.gl/iqD1n78FGSdL16Xw9          (resolved at save time)
 *   https://www.google.com/maps/place/Turbo+GMS/@41.697533,44.8839371,17z/data=…!3d41.697529!4d44.886512
 *   https://www.google.com/maps/search/?api=1&query=41.697529,44.886512
 *   https://www.google.com/maps/dir/?api=1&destination=41.697529,44.886512
 *   41.697529, 44.886512
 *
 * No I/O except resolveShortMapLink(), which is called once from the Payload
 * field hook on save — never on render.
 */

/** The workshop: Turbo GMS, Tbilisi. Used when the field is left empty. */
export const DEFAULT_MAP_CENTER = { lat: 41.697529, lng: 44.886512 } as const;
export const DEFAULT_MAP_ZOOM = 16;

export type LatLng = { lat: number; lng: number };

/** `41.697529,44.886512` — optionally spaced, optionally signed. */
const COORD_PAIR = /^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/;

/**
 * `!3d41.697529!4d44.886512` — the place's own coordinates, buried in the
 * `data=` blob of a /maps/place link. Preferred over `@lat,lng`, which is
 * only where the viewport happened to be centred when the link was copied.
 */
const DATA_COORDS = /!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/;

/** The `/@41.697533,44.8839371,17z` viewport segment. */
const AT_COORDS = /@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/;

const SHORT_LINK = /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i;

export function isShortMapLink(raw: string): boolean {
  return SHORT_LINK.test(raw.trim());
}

function toLatLng(lat: string, lng: string): LatLng | null {
  const parsed = { lat: Number(lat), lng: Number(lng) };
  const valid =
    Number.isFinite(parsed.lat) &&
    Number.isFinite(parsed.lng) &&
    Math.abs(parsed.lat) <= 90 &&
    Math.abs(parsed.lng) <= 180;
  return valid ? parsed : null;
}

export function parseLatLng(raw: string | null | undefined): LatLng | null {
  const value = (raw ?? "").trim();
  if (!value) return null;

  const bare = value.match(COORD_PAIR);
  if (bare) return toLatLng(bare[1], bare[2]);

  if (!/^https?:\/\//i.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const full = url.href;
  const data = full.match(DATA_COORDS);
  if (data) return toLatLng(data[1], data[2]);

  // The location sits in a different param depending on which Maps action
  // the link was copied from: `query` for search, `q` for the older form,
  // `destination`/`daddr` for directions, `ll`/`center` for a viewport link.
  for (const key of ["query", "q", "destination", "daddr", "ll", "center"]) {
    const param = url.searchParams.get(key)?.trim().replace(/^loc:\s*/i, "");
    const match = param?.match(COORD_PAIR);
    if (match) return toLatLng(match[1], match[2]);
  }

  const at = url.pathname.match(AT_COORDS);
  if (at) return toLatLng(at[1], at[2]);

  return null;
}

/** "41.697529,44.886512" — how the field stores what parseLatLng found. */
export function formatLatLng({ lat, lng }: LatLng): string {
  return `${lat},${lng}`;
}

/**
 * Follows a maps.app.goo.gl short link to the long URL it redirects to.
 * Called once from the Contact global's beforeValidate hook so a pasted
 * share link becomes coordinates at save time; returns null on any network
 * or redirect failure, which the field's validate() then reports.
 */
export async function resolveShortMapLink(
  shortUrl: string,
  timeoutMs = 8000,
): Promise<string | null> {
  const url = shortUrl.trim();
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeoutMs);

  try {
    // Deliberately no User-Agent override: sent a browser UA, Google answers
    // with a Firebase Dynamic Links interstitial page instead of the 302, and
    // the destination never appears in a Location header. A default fetch UA
    // gets the plain redirect.
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: abort.signal,
    });
    return res.url && res.url !== url ? res.url : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
