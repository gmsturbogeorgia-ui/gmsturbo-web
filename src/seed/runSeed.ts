import type { Payload } from "payload";
import { PRODUCTS } from "@/lib/products";
import { homeSeedAllLocales } from "./homeSeed";
import { contactSeedAllLocales } from "./contactSeed";
import { showroomSeedAllLocales } from "./showroomSeed";
import { catalogSeedAllLocales } from "./catalogSeed";

/**
 * Shared seed logic — creates a first admin user (if none exists) and
 * upserts every product from src/lib/products.ts into the `products`
 * collection, plus the `home` global. Called from both src/seed/seed.ts
 * (CLI, via `payload run`) and src/app/(payload)/api/seed/route.ts
 * (dev-only HTTP fallback — see that file for why it exists).
 *
 * `tagline`/`description` (Products) and every home-page text field are
 * `localized: true` (see payload.config.ts's `localization` block). Each
 * write uses `locale: "all"` with every localized value shaped as
 * `{ en, ka }`, in a SINGLE call per doc — not two locale-scoped calls.
 * Payload's Postgres adapter deletes and recreates an array field's rows on
 * every write that touches it, so writing `home.stats`/`home.journey.steps`
 * once per locale would silently discard the first locale's array data.
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
      tagline: { en: p.tagline, ka: p.taglineKa },
      description: { en: p.description, ka: p.descriptionKa },
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
        locale: "all",
        data,
      });
      payload.logger.info(`Updated product "${p.id}"`);
    } else {
      await payload.create({ collection: "products", locale: "all", data });
      payload.logger.info(`Created product "${p.id}"`);
    }
  }

  await payload.updateGlobal({
    slug: "home",
    locale: "all",
    data: homeSeedAllLocales(),
  });
  payload.logger.info("Updated home page content (en + ka)");

  await payload.updateGlobal({
    slug: "contact",
    locale: "all",
    data: contactSeedAllLocales(),
  });
  payload.logger.info("Updated contact page content (en + ka)");

  await payload.updateGlobal({
    slug: "showroom",
    locale: "all",
    data: showroomSeedAllLocales(),
  });
  payload.logger.info("Updated showroom page content (en + ka)");

  await payload.updateGlobal({
    slug: "catalog",
    locale: "all",
    data: catalogSeedAllLocales(),
  });
  payload.logger.info("Updated catalog page content (en + ka)");

  return `Seed complete — ${PRODUCTS.length} products, home + contact + showroom + catalog page content.`;
}
