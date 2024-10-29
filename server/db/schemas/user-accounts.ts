import * as pg from "drizzle-orm/pg-core";

import { users } from "./users";

export const userAccounts = pg.pgTable(
  "user_accounts",
  {
    userId: pg
      .uuid("user_id")
      .notNull()
      .references(() => users.id),
    provider: pg.text("provider").notNull(),
    providerUserId: pg.text("provider_user_id").notNull(),
  },
  (table) => ({
    compoundKey: pg.primaryKey({
      columns: [table.userId, table.providerUserId],
    }),
  }),
);
