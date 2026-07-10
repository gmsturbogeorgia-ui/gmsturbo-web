import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";

import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// This is TanStack Start's real, documented request handler — the same one
// its own generated default entry uses (createStartHandler({ createRouter })
// (defaultStreamHandler)). Because this project has a `src/server.ts`,
// TanStack Start auto-adopts *this* file as the server entry instead of its
// generated default, and calls its default export as `serverEntry({ request })`.
const startHandler = createStartHandler({ createRouter })(defaultStreamHandler);

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (
    !body.includes('"unhandled":true') ||
    !body.includes('"message":"HTTPError"')
  ) {
    return response;
  }

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default async function serverEntry({
  request,
}: {
  request: Request;
}): Promise<Response> {
  try {
    const response = await startHandler({ request });
    return await normalizeCatastrophicSsrResponse(response);
  } catch (error) {
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

// NOTE: this default export matches the shape TanStack Start's dev/build
// pipeline expects for a custom server entry: `(ctx: { request }) => Response`.
// It does NOT match the Cloudflare Workers module shape
// (`{ fetch(request, env, ctx) {...} }`) that `wrangler dev`/`deploy` needs.
// If/when you actually deploy to Cloudflare Workers, wrangler's entry point
// should be a small adapter file — not this one directly — that wraps this
// function, e.g.:
//
//   import serverEntry from "./server";
//   export default { fetch: (request: Request) => serverEntry({ request }) };
//
// That's a follow-up once local dev is confirmed working; wrangler.jsonc's
// `main` currently points at this file, which will need updating then.
