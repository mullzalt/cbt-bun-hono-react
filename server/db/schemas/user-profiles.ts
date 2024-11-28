import * as pg from "drizzle-orm/pg-core";

import type { ProfileMetadata } from "../../../shared/schemas/profile.schema";
import { getRandomColorHex } from "../../lib/utils/random-color";
import { users } from "./users";
import { withTimestamps } from "./util";

export const userProfiles = pg.pgTable("user_profiles", {
  userId: pg
    .uuid("user_id")
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  name: pg.text("name").notNull(),
  phoneNumber: pg.varchar("phone_number"),
  image: pg.text("picture"),
  metadata: pg
    .jsonb("metadata")
    .$type<ProfileMetadata>()
    .$defaultFn(() => ({
      colorFallback: getRandomColorHex(),
    }))
    .notNull(),
  ...withTimestamps,
});
