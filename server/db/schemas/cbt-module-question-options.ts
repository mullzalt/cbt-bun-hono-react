import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { attachments } from "./attachment";
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
    image: pg.text("image"),
    text: pg.text("text"),
    ...withTimestamps,
    ...softDeletable,
  },
);

export const questionHasAnswers = pg.pgTable(
  "question_has_answers",
  {
    id: pg.uuid("id").defaultRandom().primaryKey(),
    questionId: pg
      .uuid("question_id")
      .references(() => cbtModuleQuestions.id)
      .notNull(),
    answerId: pg
      .uuid("answer_id")
      .references(() => cbtModuleQuestionOptions.id)
      .notNull(),
    isAnswer: pg.boolean("is_answer").default(false).notNull(),
  },
  (table) => ({
    uniqueIndex: pg.unique().on(table.questionId, table.answerId),
  }),
);

export const questionHasAnswersRelations = relations(
  questionHasAnswers,
  ({ one }) => ({
    question: one(cbtModuleQuestions, {
      fields: [questionHasAnswers.questionId],
      references: [cbtModuleQuestions.id],
    }),
    answer: one(cbtModuleQuestionOptions, {
      fields: [questionHasAnswers.answerId],
      references: [cbtModuleQuestionOptions.id],
    }),
  }),
);

export const cbtModuleQuestionOptionsRelation = relations(
  cbtModuleQuestionOptions,
  ({ one }) => ({
    question: one(cbtModuleQuestions, {
      fields: [cbtModuleQuestionOptions.cbtModuleQuestionId],
      references: [cbtModuleQuestions.id],
    }),
    picture: one(attachments, {
      fields: [cbtModuleQuestionOptions.id],
      references: [attachments.tableId],
    }),
  }),
);
