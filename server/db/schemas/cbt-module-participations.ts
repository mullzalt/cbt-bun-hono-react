import * as pg from "drizzle-orm/pg-core";

import { cbtParticipations } from "./cbt-participations";
import { uuidPrimaryKey } from "./util";

export const cbtModuleParticipations = pg.pgTable("cbt_module_participations", {
  ...uuidPrimaryKey,
  cbtParticipationId: pg
    .uuid("cbt_participation_id")
    .notNull()
    .references(() => cbtParticipations.id),
  joinedAt: pg
    .timestamp("joined_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
