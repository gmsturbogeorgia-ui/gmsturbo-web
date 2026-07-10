/**
 * Keeps a reference to the most recent uncaught server-side error so that
 * src/server.ts can attach real diagnostics when the SSR handler swallows an
 * exception into a generic 500 JSON response.
 */
let lastCapturedError: unknown;

function capture(error: unknown) {
  lastCapturedError = error;
}

if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("uncaughtException", capture);
  process.on("unhandledRejection", capture);
}

export function consumeLastCapturedError(): unknown {
  const error = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
