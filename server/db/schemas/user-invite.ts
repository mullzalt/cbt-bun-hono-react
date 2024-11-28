import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { userRole, users } from "./users";

export const userInvitations = pg.pgTable("user_invitations", {
  id: pg.uuid("id").defaultRandom().primaryKey(),
  inviteeId: pg
    .uuid("invitee_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: pg.text("token").unique().notNull(),
  role: userRole("role").default("student").notNull(),
  userId: pg.uuid("user_id").references(() => users.id),
  sentAt: pg
    .timestamp("sent_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: pg
    .timestamp("expires_at", { mode: "date", withTimezone: true })
    .notNull(),
  acceptedAt: pg.timestamp("accepted_at", { mode: "date", withTimezone: true }),
});

export const invitationRelations = relations(userInvitations, ({ one }) => ({
  invitee: one(users, {
    fields: [userInvitations.inviteeId],
    references: [users.id],
  }),
  user: one(users, {
    fields: [userInvitations.userId],
    references: [users.id],
  }),
}));
