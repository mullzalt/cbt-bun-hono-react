import * as pg from "drizzle-orm/pg-core";

import { cbtModuleQuestions } from "./cbt-module-questions";
import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtModuleQuestionOptions = pg.pgTable(
  "cbt_module_question_options",
  {
    ...uuidPrimaryKey,
    cbtModuleQuestionId: pg
      .uuid("cbt_module_question_id")
      .notNull()
      .references(() => cbtModuleQuestions.id),
    isAnswer: pg.boolean("is_answer").notNull().default(false),
    image: pg.text("image"),
    text: pg.text("text"),
    ...withTimestamps,
    ...softDeletable,
  },
);
