import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { userStudentProfiles } from "./user-profile-students";
import { userProfiles } from "./user-profiles";
import { uuidPrimaryKey, withTimestamps } from "./util";

export const userRole = pg.pgEnum("user_role", ["admin", "teacher", "student"]);

export const users = pg.pgTable("users", {
  ...uuidPrimaryKey,
  email: pg.varchar("email").notNull().unique(),
  passwordHash: pg.text("password_hash"),
  emailVerifiedAt: pg.timestamp("email_verified_at", {
    mode: "date",
    withTimezone: true,
  }),
  role: userRole("role").notNull().default("student"),
  ...withTimestamps,
});

export const userRelations = relations(users, ({ one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  studentProfile: one(userStudentProfiles, {
    fields: [users.id],
    references: [userStudentProfiles.userId],
  }),
}));
