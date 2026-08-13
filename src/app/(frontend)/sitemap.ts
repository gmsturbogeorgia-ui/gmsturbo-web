import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE_URL = "https://gmsturbo.ge";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/showroom`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    ...PRODUCTS.map((p) => ({
      url: `${BASE_URL}/catalog/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
