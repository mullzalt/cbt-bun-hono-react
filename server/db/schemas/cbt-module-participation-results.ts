import * as pg from "drizzle-orm/pg-core";

import { cbtModuleParticipations } from "./cbt-module-participations";

export const cbtModuleParticipationResults = pg.pgTable(
  "cbt_module_participation_results",
  {
    cbtModuleParticipationId: pg
      .uuid("cbt_module_participation_id")
      .notNull()
      .references(() => cbtModuleParticipations.id)
      .primaryKey(),
    finishedAt: pg
      .timestamp("finished_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    correctCount: pg.integer("corrent_count"),
    incorrectCount: pg.integer("incorrent_count"),
    nullCount: pg.integer("null_count"),
    totalScore: pg.integer("total_score"),
  },
);
