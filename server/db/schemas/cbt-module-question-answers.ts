import * as pg from "drizzle-orm/pg-core";

import { cbtModuleParticipations } from "./cbt-module-participations";
import { cbtModuleQuestionOptions } from "./cbt-module-question-options";
import { cbtModuleQuestions } from "./cbt-module-questions";

export const cbtModuleQuestionAnswers = pg.pgTable(
  "cbt_module_question_answers",
  {
    cbtModuleParticipationId: pg
      .uuid("cbt_module_participation_id")
      .notNull()
      .references(() => cbtModuleParticipations.id),
    cbtModuleQuestionId: pg
      .uuid("cbt_module_question_id")
      .notNull()
      .references(() => cbtModuleQuestions.id),
    cbtModuleQuestionOptionId: pg
      .uuid("cbt_module_question_option_id")
      .notNull()
      .references(() => cbtModuleQuestionOptions.id),
  },
);
