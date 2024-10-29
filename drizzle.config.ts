import { defineConfig } from "drizzle-kit";

import { Env } from "@/lib/env";

export default defineConfig({
  schema: "./server/db/schemas/index.ts",
  out: "./server/db/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: Env.DATABASE_URL,
  },
});
