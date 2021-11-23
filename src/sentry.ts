import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  release: "textcat-ng@" + import.meta.env.VITE_GIT_VERSION,
  dsn: "https://d9bae5535c394f4fba698f8e9b066a58@o322586.ingest.sentry.io/5539026",
  integrations: [new Integrations.BrowserTracing()]
});
