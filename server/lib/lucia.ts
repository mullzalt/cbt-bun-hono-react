import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import type { User } from "../../shared/schemas/user.schema";
import { DB } from "../db";
import { users, userSessions } from "../db/schemas";

const adapter = new DrizzlePostgreSQLAdapter(DB, userSessions, users);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    const { passwordHash, image, emailVerifiedAt, ...rest } = attributes;
    return {
      ...rest,
      image: image ?? "",
      emailVerified: Boolean(emailVerifiedAt),
      hasPassword: Boolean(passwordHash),
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}

export { lucia };
