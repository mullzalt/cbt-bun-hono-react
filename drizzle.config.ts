import { defineConfig } from "drizzle-kit";

import { config } from "./server/lib/config";

export default defineConfig({
  schema: "./server/db/schemas/index.ts",
  out: "./server/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: config.database.url,
  },
});
