import type { InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { userAccounts } from "../db/schemas";

type InsertAccount = InferInsertModel<typeof userAccounts>;

export const accountRepository = () => {
  const db = DB;
  const table = userAccounts;

  const create = (value: InsertAccount, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);

  return {
    create,
  };
};
