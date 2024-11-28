import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { cbtModules } from "./cbt-modules";
import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtSubjects = pg.pgTable("cbt_subjects", {
  ...uuidPrimaryKey,
  name: pg.varchar("name").notNull(),
  ...withTimestamps,
  ...softDeletable,
});

export const cbtSubjectRelations = relations(cbtSubjects, ({ many }) => ({
  modules: many(cbtModules),
}));
