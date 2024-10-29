import * as pg from "drizzle-orm/pg-core";

import { cbts } from "./cbts";
import { users } from "./users";
import { withTimestamps } from "./util";

export const cbtMembers = pg.pgTable(
  "cbt_members",
  {
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id),
    cbtId: pg
      .uuid("cbt_id")
      .notNull()
      .references(() => cbts.id),
    createdAt: withTimestamps.createdAt,
  },
  (table) => ({
    compoundKey: pg.primaryKey({
      columns: [table.userId, table.cbtId],
    }),
  }),
);
