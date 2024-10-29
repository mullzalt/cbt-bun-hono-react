import * as pg from "drizzle-orm/pg-core";

export const withTimestamps = {
  createdAt: pg
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: pg
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const softDeletable = {
  deletedAt: pg.timestamp("deleted_at", { withTimezone: true }),
};

export const uuidPrimaryKey = {
  id: pg.uuid("id").defaultRandom().notNull().primaryKey(),
};
