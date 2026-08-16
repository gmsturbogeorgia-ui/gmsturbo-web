import { getPayload } from "payload";
import config from "@payload-config";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  parseLatLng,
} from "@/lib/mapQuery";
import type { Locale } from "./i18n/locales";

// Server-only data access for the `contact` Payload global — same shape as
// src/lib/getHome.ts, which see for why this is no longer a field-by-field
// mapping of `{ en, ka }` pairs.
export type ContactContent = {
  hero: { tag: string; title1: string; title2: string; blurb: string };
  info: {
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    addressLabel: string;
    addressLine1: string;
    addressLine2: string;
    hoursLabel: string;
    hoursVal: string;
    saturdayLabel: string;
    saturdayVal: string;
  };
  booking: { kicker: string; title1: string; title2: string; blurb: string };
  findUs: {
    kicker: string;
    title: string;
    /** Where the Leaflet map drops its pin, and how tight it zooms in. */
    map: { lat: number; lng: number; zoom: number };
    caption: string;
  };
};

// The map coordinates are the one field that isn't stored the way the page
// wants it: the admin holds a "lat,lng" string plus a zoom, both nullable.
type ContactDoc = Omit<ContactContent, "findUs"> & {
  findUs: Omit<ContactContent["findUs"], "map"> & {
    mapQuery?: string | null;
    mapZoom?: number | null;
  };
};

export async function getContact(locale: Locale): Promise<ContactContent> {
  const payload = await getPayload({ config });
  const doc = (await payload.findGlobal({
    slug: "contact",
    locale,
    depth: 0,
  })) as unknown as ContactDoc;

  return {
    ...doc,
    findUs: {
      ...doc.findUs,
      // mapQuery is stored as "lat,lng" (the field hook resolves whatever
      // link was pasted). Parsing again here keeps rows written before that
      // hook existed — or by hand — from putting the map in the sea.
      map: {
        ...(parseLatLng(doc.findUs.mapQuery) ?? DEFAULT_MAP_CENTER),
        zoom: doc.findUs.mapZoom ?? DEFAULT_MAP_ZOOM,
      },
    },
  };
}
