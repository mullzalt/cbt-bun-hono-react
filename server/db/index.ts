import type {
  Logger as DrizzleLogger,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";

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

export type DatabaseSchemas = {
  [K in keyof typeof schema]: (typeof schema)[K];
};

export const DB = drizzle<DatabaseSchemas>(pool, {
  schema,
  logger: new DBLogger(),
});

export type Transaction = PgTransaction<
  PgQueryResultHKT,
  DatabaseSchemas,
  ExtractTablesWithRelations<DatabaseSchemas>
>;

export type Database = typeof DB;
