import type { Payload } from "payload";
import { PRODUCTS } from "@/lib/products";

/**
 * Shared seed logic — creates a first admin user (if none exists) and
 * upserts every product from src/lib/products.ts into the `products`
 * collection. Called from both src/seed/seed.ts (CLI, via `payload run`)
 * and src/app/(payload)/api/seed/route.ts (dev-only HTTP fallback — see
 * that file for why it exists).
 */
export async function runSeed(payload: Payload): Promise<string> {
  const existingUsers = await payload.find({
    collection: "users",
    limit: 1,
  });

  if (existingUsers.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || "admin@gmsturbo.ge";
    const password = process.env.SEED_ADMIN_PASSWORD || "change-me-1234!";
    await payload.create({
      collection: "users",
      data: { email, password },
    });
    payload.logger.info(`Created admin user ${email}`);
  } else {
    payload.logger.info("Admin user already exists, skipping.");
  }

  for (const p of PRODUCTS) {
    const data = {
      productId: p.id,
      name: p.name,
      code: p.code,
      category: p.category,
      vehicles: p.vehicles,
      fitments: p.fitments,
      boost: p.boost,
      hp: p.hp,
      price: p.price,
      img: p.img,
      gallery: p.gallery.map((src) => ({ src })),
      stock: p.stock,
      tagline: p.tagline,
      taglineKa: p.taglineKa,
      description: p.description,
      descriptionKa: p.descriptionKa,
      specs: p.specs,
    };

    const existing = await payload.find({
      collection: "products",
      where: { productId: { equals: p.id } },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      await payload.update({
        collection: "products",
        id: existing.docs[0].id,
        data,
      });
      payload.logger.info(`Updated product "${p.id}"`);
    } else {
      await payload.create({ collection: "products", data });
      payload.logger.info(`Created product "${p.id}"`);
    }
  }

  return `Seed complete — ${PRODUCTS.length} products.`;
}
