/**
 * Seeds the Payload-backed database from the site's existing static catalog
 * data (src/lib/products.ts), plus a first admin user so /admin is usable
 * immediately after setup.
 *
 * Run with: npm run seed
 * (wraps `payload run src/seed/seed.ts`, which boots Payload's Local API
 * against payload.config.ts before executing this file)
 *
 * NOTE: on some Windows + Node setups, `payload run` fails with
 * ERR_PACKAGE_PATH_NOT_EXPORTED on the `file-type` package (a known upstream
 * Payload/tsx module-resolution bug on Windows, unrelated to this project's
 * code). If that happens, use the dev-only fallback instead: run `npm run
 * dev`, then visit http://localhost:3000/api/seed once — see
 * src/app/(payload)/api/seed/route.ts.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { runSeed } from "./runSeed";

async function seed() {
  const payload = await getPayload({ config });
  const message = await runSeed(payload);
  payload.logger.info(message);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
