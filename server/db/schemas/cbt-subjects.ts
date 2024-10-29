import * as pg from "drizzle-orm/pg-core";

import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtSubjects = pg.pgTable("cbt_subjects", {
  ...uuidPrimaryKey,
  name: pg.varchar("name").notNull(),
  ...withTimestamps,
  ...softDeletable,
});
