import * as pg from "drizzle-orm/pg-core";

import { users } from "./users";
import { withTimestamps } from "./util";

export const userStudentProfiles = pg.pgTable("user_student_profiles", {
  userId: pg
    .uuid("user_id")
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  parentPhoneNumber: pg.varchar("parent_phone_number").notNull(),
  address: pg.text("address").notNull(),
  grade: pg.varchar("grade").notNull(),
  school: pg.varchar("school").notNull(),
  targetUniversity: pg.varchar("target_university").notNull(),
  ...withTimestamps,
});
