import * as pg from "drizzle-orm/pg-core";

import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbts = pg.pgTable("cbts", {
  ...uuidPrimaryKey,
  name: pg.varchar("name").notNull(),
  description: pg.text("description"),
  openedAt: pg.timestamp("opened_at", { mode: "date", withTimezone: true }),
  closedAt: pg.timestamp("closed_at", { mode: "date", withTimezone: true }),
  publishedAt: pg.timestamp("published_at", {
    mode: "date",
    withTimezone: true,
  }),
  ...withTimestamps,
  ...softDeletable,
});
