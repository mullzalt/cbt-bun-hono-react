import { faker } from "@faker-js/faker";

import type { CbtSubject } from "../../../shared/schemas/cbt-subject.schema";
import { cbtSubjects } from "../schemas";
import { seederDB, type Seeder } from "./util";

const generateFakeSubject = (): Partial<CbtSubject> => ({
  name: faker.book.title(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});

export const cbtSubjectSeeder: Seeder<typeof cbtSubjects> = {
  clean: async () => await seederDB.delete(cbtSubjects),
  seed: async (count = 4) => {
    const fake = faker.helpers.multiple(generateFakeSubject, {
      count,
    }) as CbtSubject[];
    return await seederDB.insert(cbtSubjects).values(fake).returning();
  },
};
