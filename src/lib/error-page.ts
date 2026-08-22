/**
 * Minimal, dependency-free HTML fallback page rendered when the SSR pipeline
 * fails before React can take over (e.g. a crash inside the root document
 * shell). Intentionally plain so it never depends on the app's own CSS/JS
 * bundles, which may be the thing that failed to load.
 */
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Something went wrong - GMS Turbo Georgia</title>
    <style>
      html, body {
        margin: 0;
        min-height: 100vh;
        background: #050505;
        color: #fafafa;
        font-family: system-ui, -apple-system, sans-serif;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
      }
      .box { max-width: 28rem; text-align: center; }
      h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
      p { color: #999; font-size: .875rem; line-height: 1.5; margin: 0; }
      a {
        display: inline-block;
        margin-top: 1.5rem;
        padding: .75rem 1.5rem;
        background: #ff4a2b;
        color: #fff;
        text-decoration: none;
        font-size: .8rem;
        letter-spacing: .1em;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>This page didn&#39;t load</h1>
      <p>Something went wrong on our end. Please try again in a moment.</p>
      <a href="/">Go home</a>
    </div>
  </body>
</html>`;
}
