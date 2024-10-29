import * as pg from "drizzle-orm/pg-core";

import { uuidPrimaryKey, withTimestamps } from "./util";

export const userRole = pg.pgEnum("user_role", ["admin", "teacher", "student"]);

export const users = pg.pgTable("users", {
  ...uuidPrimaryKey,
  email: pg.varchar("email").notNull().unique(),
  name: pg.text("name").notNull(),
  phoneNumber: pg.varchar("phone_number"),
  image: pg.text("picture"),
  passwordHash: pg.text("password_hash"),
  emailVerifiedAt: pg.timestamp("email_verified_at", {
    mode: "date",
    withTimezone: true,
  }),
  role: userRole("role").notNull().default("student"),
  ...withTimestamps,
});
