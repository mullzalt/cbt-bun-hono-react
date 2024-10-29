import * as pg from "drizzle-orm/pg-core";

import { users } from "./users";

export const userSessions = pg.pgTable("user_sessions", {
  id: pg.text("id").primaryKey(),
  userId: pg
    .uuid("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: pg
    .timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
});
