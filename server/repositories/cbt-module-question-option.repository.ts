import { type InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { cbtModuleQuestionOptions } from "../db/schemas";
import { makeDrizzlePgHelper } from "../lib/db";
import { hasOneAttachment } from "../lib/db/attachable";

type Insert = InferInsertModel<typeof cbtModuleQuestionOptions>;
type Update = Partial<Insert>;

export const optionRepository = () => {
  const db = DB;
  const table = cbtModuleQuestionOptions;
  const helper = makeDrizzlePgHelper(cbtModuleQuestionOptions);

  const { attach, detach } = hasOneAttachment(table);

  const create = (value: Insert, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);

  const update = (id: string, value: Update, tx: Transaction | Database = db) =>
    tx
      .update(table)
      .set(value)
      .where(helper.where((col, { eq }) => eq(col.id, id)));

  const delete_ = (id: string, tx: Transaction | Database = db) =>
    tx
      .update(table)
      .set({
        deletedAt: new Date(),
      })
      .where(helper.where((col, { eq }) => eq(col.id, id)));

  return {
    create,
    update,
    delete: delete_,
    attach,
    detach,
  };
};
