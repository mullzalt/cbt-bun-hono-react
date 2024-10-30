import type { Logger as DrizzleLogger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import { logger } from "@/lib/logger";

import { config } from "../lib/config";
import * as schema from "./schemas";

class DBLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.debug({ query, params });
  }
}

export const pool = new Pool({
  connectionString: config.database.url,
});

export const DB = drizzle(pool, { schema, logger: new DBLogger() });
