import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

export const arrayOrderable = pg.pgTable(
  "array_orderable",
  {
    referenceId: pg.uuid("reference_id").notNull(),
    orderable: pg.varchar("orderable").notNull(),
    referenceType: pg.varchar("reference_type").notNull(),
    ids: pg
      .uuid("ids")
      .array()
      .notNull()
      .default(sql`ARRAY[]::uuid[]`),
  },
  (table) => ({
    compositeKey: pg.primaryKey({
      columns: [table.orderable, table.referenceId, table.referenceType],
    }),
  }),
);
