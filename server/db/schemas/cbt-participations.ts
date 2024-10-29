import * as pg from "drizzle-orm/pg-core";

import { cbts } from "./cbts";
import { users } from "./users";
import { uuidPrimaryKey } from "./util";

export const cbtParticipations = pg.pgTable(
  "cbt_participations",
  {
    ...uuidPrimaryKey,
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id),
    cbtId: pg
      .uuid("cbt_id")
      .notNull()
      .references(() => cbts.id),
    joinedAt: pg
      .timestamp("joined_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    unique: pg.unique().on(table.cbtId, table.userId),
  }),
);
