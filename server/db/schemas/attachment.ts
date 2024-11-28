import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { withTimestamps } from "./util";

export const attachmentFiles = pg.pgTable("attachment_files", {
  id: pg.uuid("id").defaultRandom().primaryKey(),
  name: pg.text("name").notNull(),
  mimeType: pg.varchar("mime_type").notNull(),
  size: pg.integer("size").notNull(),
  path: pg.text("path").notNull(),
  url: pg.text("url").notNull(),
  checksum: pg.text("checksum").notNull(),
  ...withTimestamps,
});

export const attachments = pg.pgTable(
  "attachments",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    fileId: pg
      .uuid("attachment_file_id")
      .notNull()
      .references(() => attachmentFiles.id),
    table: pg.text("table").notNull(),
    tableId: pg.uuid("tableId").notNull(),
    ...withTimestamps,
  },
  (t) => ({
    unique: pg.unique().on(t.fileId, t.table, t.tableId),
  }),
);

export const attachmentToFile = relations(attachments, ({ one }) => ({
  file: one(attachmentFiles, {
    fields: [attachments.fileId],
    references: [attachmentFiles.id],
  }),
}));
