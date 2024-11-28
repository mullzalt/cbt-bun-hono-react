import { faker } from "@faker-js/faker";

import type { User, UserRole } from "../../../shared/schemas/user.schema";
import { users } from "../schemas";
import { seederDB, type Seeder } from "./util";

const roles: UserRole[] = ["admin", "teacher", "student"];

function randomUser(passwordHash: string, date: Date): Partial<User> {
  return {
    email: faker.internet.email(),
    emailVerifiedAt: date,
    passwordHash,
    role: roles[Math.floor(Math.random() * roles.length)],
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}

export const userSeeder: Seeder<typeof users> = {
  clean: async () => await seederDB.delete(users),
  seed: async (count = 100) => {
    const passwordHash = await Bun.password.hash("asdfasdf");
    const now = new Date();
    const fakeUsers = faker.helpers.multiple(
      () => randomUser(passwordHash, now),
      {
        count,
      },
    ) as User[];

    const fixedUser = [
      {
        email: "admin@twittor.ac",
        passwordHash,
        role: "admin",
        emailVerifiedAt: now,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ] as User[];

    return await seederDB
      .insert(users)
      .values([...fakeUsers, ...fixedUser])
      .returning();
  },
};
