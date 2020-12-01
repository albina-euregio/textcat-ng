import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  release: "textcat-ng@" + process.env.GIT_VERSION,
  dsn:
    "https://d9bae5535c394f4fba698f8e9b066a58@o322586.ingest.sentry.io/5539026",
  integrations: [new Integrations.BrowserTracing()]
});
