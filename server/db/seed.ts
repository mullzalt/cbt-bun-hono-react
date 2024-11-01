import { drizzle } from "drizzle-orm/node-postgres";

import { faker } from "@faker-js/faker";
import { Pool } from "pg";

import type { UserRole } from "../../shared/schemas/user.schema";
import { config } from "../lib/config";
import { logger } from "../lib/logger";
import * as schema from "./schemas";

const pool = new Pool({
  connectionString: config.database.url,
});

const DB = drizzle(pool, { schema });

const roles: UserRole[] = ["admin", "teacher", "student"];

function randomUser(
  passwordHash: string,
  date: Date,
): typeof schema.users.$inferInsert {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerifiedAt: date,
    passwordHash,
    image: faker.image.avatar(),
    role: roles[Math.floor(Math.random() * roles.length)],
  };
}

async function seedUser() {
  const passwordHash = await Bun.password.hash("asdfasdf");
  const now = new Date();
  const fakeUsers = faker.helpers.multiple(
    () => randomUser(passwordHash, now),
    {
      count: 100,
    },
  );
  return await DB.insert(schema.users).values([
    ...fakeUsers,
    {
      name: "Admin User",
      email: "admin@twittor.ac",
      image: faker.image.avatar(),
      passwordHash,
      role: "admin",
    },
  ]);
}

async function main() {
  logger.info("Seeding database...");
  //call function

  await seedUser();

  logger.info("seeding done!");
  process.exit();
}

main();
