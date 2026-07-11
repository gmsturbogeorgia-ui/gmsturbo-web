/* Payload's own root layout for the /admin panel. Lives in its own route
   group (payload) so it can render a fully independent <html>/<body> — see
   the sibling (frontend) group for the site's root layout. Next.js supports
   multiple root layouts this way as long as no layout.tsx sits directly in
   src/app. Do not add site chrome (SiteHeader, LanguageProvider, etc.) here;
   this tree is the CMS admin UI, not a page of the marketing site. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
