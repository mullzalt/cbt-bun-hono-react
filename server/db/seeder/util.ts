import type { InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgTable } from "drizzle-orm/pg-core";

import { Pool } from "pg";

import { config } from "../../lib/config";
import * as schema from "../schemas";

export interface Seeder<
  TTable extends PgTable,
  TArgs = never[],
  TData extends InferSelectModel<TTable> = InferSelectModel<TTable>,
> {
  clean: () => Promise<unknown>;
  seed: (count: number, ...args: TArgs[]) => Promise<TData[]>;
}

const pool = new Pool({
  connectionString: config.database.url,
  max: 1,
});

export const seederDB = drizzle(pool, { schema });
