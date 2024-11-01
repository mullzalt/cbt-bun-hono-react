import type { Logger as DrizzleLogger } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import { config } from "../lib/config";
import { logger } from "../lib/logger";
import * as schema from "./schemas";

class DBLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.debug({ params: params.join(", ") }, query);
  }
}

export const pool = new Pool({
  connectionString: config.database.url,
});

export const DB = drizzle(pool, { schema, logger: new DBLogger() });
