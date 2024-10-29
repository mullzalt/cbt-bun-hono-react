import * as pg from "drizzle-orm/pg-core";

import { cbtModules } from "./cbt-modules";
import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtModuleQuestions = pg.pgTable("cbt_module_questions", {
  ...uuidPrimaryKey,
  cbtModuleId: pg
    .uuid("cbt_module_id")
    .notNull()
    .references(() => cbtModules.id),
  image: pg.text("image"),
  text: pg.text("text"),
  ...withTimestamps,
  ...softDeletable,
});
