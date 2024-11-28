import { faker } from "@faker-js/faker";

import type { CbtModule } from "../../../shared/schemas/cbt-module.schema";
import { cbtModules } from "../schemas";
import { seederDB, type Seeder } from "./util";

type Arg = { cbtId: string; cbtSubjectId: string };

const generateFakeModule = ({
  cbtId,
  cbtSubjectId,
}: Arg): Partial<CbtModule> => ({
  cbtId,
  cbtSubjectId,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
});

export const cbtModuleSeeder: Seeder<typeof cbtModules, Arg> = {
  clean: async () => await seederDB.delete(cbtModules),
  seed: async (count = 1, { cbtId, cbtSubjectId }: Arg) => {
    const fake = faker.helpers.multiple(
      () => generateFakeModule({ cbtId, cbtSubjectId }),
      {
        count,
      },
    ) as CbtModule[];
    return await seederDB.insert(cbtModules).values(fake).returning();
  },
};
