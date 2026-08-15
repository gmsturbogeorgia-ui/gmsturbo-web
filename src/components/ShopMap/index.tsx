"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/**
 * The workshop location map on /contact.
 *
 * Leaflet + OpenStreetMap tiles rather than a Google embed: no API key, no
 * billing account, and CARTO's dark basemap sits on the page's near-black
 * ramp natively instead of needing a CSS invert filter to fake it.
 *
 * Leaflet touches `window` at import time, so the library is pulled in with a
 * dynamic import inside the effect — the component itself renders an empty
 * div on the server. Chrome styling (zoom buttons, attribution) lives in the
 * `.leaflet-*` block at the bottom of globals.css.
 */
export function ShopMap({
  lat,
  lng,
  zoom = 16,
  label,
  className,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  /** Tooltip on the pin, and the map's accessible name. */
  label: string;
  className?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current) return;

      map = L.map(holder.current, {
        center: [lat, lng],
        zoom,
        // A map that eats the page scroll is the single most annoying thing
        // an embed can do. Ctrl/⌘+wheel still zooms, and so do the buttons.
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      ).addTo(map);

      // Leaflet's default marker is a PNG resolved relative to the CSS, which
      // bundlers routinely break. A divIcon is markup we control — and this
      // one is the brand pin rather than a stock blue teardrop.
      const pin = L.divIcon({
        className: "shop-pin",
        html: `<span class="shop-pin__pulse"></span><span class="shop-pin__dot"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([lat, lng], { icon: pin, title: label, alt: label })
        .addTo(map)
        .bindTooltip(label, { direction: "top", offset: [0, -14] });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, zoom, label]);

  return (
    <div
      ref={holder}
      className={className}
      role="application"
      aria-label={label}
    />
  );
}
