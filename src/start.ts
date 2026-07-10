// Use runtime require to avoid TypeScript complaining if the package's types
// don't export createStart. Treat the module as any so code can run.
const { createStart, createMiddleware } =
  require("@tanstack/react-start") as any;

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(
  async ({ next }: { next: () => Promise<Response> }) => {
    try {
      return await next();
    } catch (error) {
      if (error != null && typeof error === "object" && "statusCode" in error) {
        throw error;
      }
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
