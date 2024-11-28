import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { attachments } from "./attachment";
import {
  cbtModuleQuestionOptions,
  questionHasAnswers,
} from "./cbt-module-question-options";
import { cbtModules } from "./cbt-modules";
import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtModuleQuestions = pg.pgTable("cbt_module_questions", {
  ...uuidPrimaryKey,
  cbtModuleId: pg
    .uuid("cbt_module_id")
    .notNull()
    .references(() => cbtModules.id),
  image: pg.text("image"),
  text: pg.text("text").notNull().default(""),
  ...withTimestamps,
  ...softDeletable,
});

export const cbtModuleQuestionsRelation = relations(
  cbtModuleQuestions,
  ({ many, one }) => ({
    options: many(cbtModuleQuestionOptions),
    answers: many(questionHasAnswers),
    picture: one(attachments, {
      fields: [cbtModuleQuestions.id],
      references: [attachments.tableId],
    }),
    module: one(cbtModules, {
      fields: [cbtModuleQuestions.cbtModuleId],
      references: [cbtModules.id],
    }),
  }),
);
