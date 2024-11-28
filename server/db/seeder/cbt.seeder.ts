import { faker } from "@faker-js/faker";

import type { Cbt } from "../../../shared/schemas/cbt.schema";
import { cbts } from "../schemas";
import { seederDB, type Seeder } from "./util";

const cbtFaker = (): Partial<Cbt> => ({
  name: faker.lorem.word({ length: { min: 2, max: 4 } }),
  publishedAt: faker.date.recent(),
  openedAt: faker.date.soon({ days: 1 }),
  closedAt: faker.date.soon({ days: 4 }),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});

export const cbtSeeder: Seeder<typeof cbts> = {
  clean: async () => await seederDB.delete(cbts),
  seed: async (count = 20) => {
    const fake = faker.helpers.multiple(cbtFaker, { count }) as Cbt[];
    const data = await seederDB.insert(cbts).values(fake).returning();
    return data;
  },
};
