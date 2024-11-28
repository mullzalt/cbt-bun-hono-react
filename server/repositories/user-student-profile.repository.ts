import type { InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { userStudentProfiles } from "../db/schemas";

type InsertProfile = InferInsertModel<typeof userStudentProfiles>;

export const studentProfileRepository = () => {
  const db = DB;
  const table = userStudentProfiles;

  const create = (value: InsertProfile, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);
  const update = (
    value: Partial<InsertProfile>,
    tx: Transaction | Database = db,
  ) => tx.update(table).set(value);

  return {
    create,
    update,
  };
};
