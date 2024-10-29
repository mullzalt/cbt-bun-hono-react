import * as pg from "drizzle-orm/pg-core";

import { cbtParticipations } from "./cbt-participations";

export const cbtParticipationResults = pg.pgTable("cbt_participation_results", {
  cbtParticipationId: pg
    .uuid("cbt_participations_id")
    .notNull()
    .references(() => cbtParticipations.id)
    .primaryKey(),
  finishedAt: pg
    .timestamp("finished_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  totalScore: pg.integer("total_score"),
});
