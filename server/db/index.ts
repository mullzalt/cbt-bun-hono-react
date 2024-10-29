import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import { config } from "../lib/config";
import * as schema from "./schemas";

export const pool = new Pool({
  connectionString: config.database.url,
});

export const DB = drizzle(pool, { schema, logger: true });
