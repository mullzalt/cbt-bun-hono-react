import type { InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { userProfiles } from "../db/schemas";

type InsertProfile = InferInsertModel<typeof userProfiles>;

export const profileRepository = () => {
  const db = DB;
  const table = userProfiles;

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
