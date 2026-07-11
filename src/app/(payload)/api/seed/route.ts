/**
 * Dev-only fallback for seeding, for machines where `npm run seed` hits the
 * Windows/`payload run`/`file-type` ERR_PACKAGE_PATH_NOT_EXPORTED bug (an
 * upstream Payload+tsx issue, not specific to this project). Running the
 * exact same seed logic from inside Next's own dev server sidesteps it,
 * since Next bundles dependencies with webpack/turbopack instead of tsx's
 * CJS/ESM interop shim.
 *
 * Usage: `npm run dev`, then visit http://localhost:3000/api/seed once.
 * Disabled outside development so it can never run in production.
 */
import config from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";
import { runSeed } from "@/seed/runSeed";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { ok: false, error: "Seeding via HTTP is disabled outside development." },
      { status: 403 },
    );
  }

  try {
    const payload = await getPayload({ config });
    const message = await runSeed(payload);
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
