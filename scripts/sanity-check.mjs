#!/usr/bin/env node
// Runs scripts/sanity-check.ts through Vite's SSR module loader
// (the model code relies on Vite features such as import.meta.env/glob).
import { createServer } from "vite";

const server = await createServer({
  configFile: false,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
let code = 2;
try {
  const { main } = await server.ssrLoadModule("/scripts/sanity-check.ts");
  code = main(process.argv.slice(2));
} finally {
  await server.close();
}
process.exit(code);
