import { type InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { questionHasAnswers } from "../db/schemas";
import { makeDrizzlePgHelper } from "../lib/db";

type Insert = InferInsertModel<typeof questionHasAnswers>;
type Update = Partial<Insert>;

export const questionHasAnswerRepository = () => {
  const db = DB;
  const table = questionHasAnswers;
  const helper = makeDrizzlePgHelper(questionHasAnswers);

  const update = (value: Update, tx: Transaction | Database = db) =>
    tx.update(table).set(value);

  const create = (value: Insert, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);

  const upsert = (value: Insert, tx: Transaction | Database = db) =>
    tx
      .insert(table)
      .values(value)
      .onConflictDoUpdate({
        target: [table.questionId, table.answerId],
        set: { isAnswer: value.isAnswer },
      });

  return {
    update,
    create,
    upsert,
    helper,
  };
};
