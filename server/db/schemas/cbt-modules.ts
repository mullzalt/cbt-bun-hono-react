import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { cbtModuleQuestions } from "./cbt-module-questions";
import { cbtSubjects } from "./cbt-subjects";
import { cbts } from "./cbts";
import { softDeletable, uuidPrimaryKey, withTimestamps } from "./util";

export const cbtModules = pg.pgTable("cbt_modules", {
  ...uuidPrimaryKey,
  cbtId: pg
    .uuid("cbt_id")
    .notNull()
    .references(() => cbts.id),
  cbtSubjectId: pg
    .uuid("cbt_subject_id")
    .notNull()
    .references(() => cbtSubjects.id),
  duration: pg
    .integer("duration")
    .notNull()
    .default(90 * 60 * 1000), // default 90 minutes
  scoreOnCorrect: pg.integer("score_on_correct").notNull().default(3),
  scoreOnWrong: pg.integer("score_on_wrong").notNull().default(0),
  scoreOnNull: pg.integer("score_on_null").notNull().default(0),
  shouldShuffleQuestions: pg
    .boolean("should_shuffle_questions")
    .notNull()
    .default(false),
  shouldShuffleQuestionOptions: pg
    .boolean("should_shuffle_question_options")
    .notNull()
    .default(false),

  description: pg.text("description"),
  questionsCount: pg.integer("questions_count"),
  optionsCount: pg.integer("options_count"),

  ...withTimestamps,
  ...softDeletable,
});

export const cbtModulesRelations = relations(cbtModules, ({ one, many }) => ({
  subject: one(cbtSubjects, {
    fields: [cbtModules.cbtSubjectId],
    references: [cbtSubjects.id],
  }),
  questions: many(cbtModuleQuestions),
  question: one(cbtModuleQuestions, {
    fields: [cbtModules.id],
    references: [cbtModuleQuestions.cbtModuleId],
  }),
}));
