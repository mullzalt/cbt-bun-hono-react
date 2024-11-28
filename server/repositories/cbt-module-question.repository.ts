import { count, type InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { cbtModuleQuestions } from "../db/schemas";
import { makeDrizzlePgHelper } from "../lib/db";
import { hasOneAttachment } from "../lib/db/attachable";

type Insert = InferInsertModel<typeof cbtModuleQuestions>;
type Update = Partial<Insert>;

export const questionRepository = () => {
  const db = DB;
  const table = cbtModuleQuestions;
  const helper = makeDrizzlePgHelper(cbtModuleQuestions);

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

  const findMany = (cbtModuleId: string) =>
    db.query.cbtModuleQuestions.findMany({
      where: (col, { eq, and, isNull }) =>
        and(eq(col.cbtModuleId, cbtModuleId), isNull(col.deletedAt)),
      columns: { image: false },
      with: {
        picture: {
          columns: {},
          with: { file: { columns: { url: true } } },
        },
        options: {
          columns: { text: true, id: true },
          orderBy: (col, { asc }) => asc(col.createdAt),
          where: (col, { isNull }) => isNull(col.deletedAt),
          with: {
            picture: {
              columns: {},
              with: { file: { columns: { url: true } } },
            },
          },
        },
        answers: {
          columns: { answerId: true, isAnswer: true },
          where: (col, { eq }) => eq(col.isAnswer, true),
        },
      },
      orderBy: (col, { asc }) => asc(col.createdAt),
    });

  const findById = (id: string) =>
    db.query.cbtModuleQuestions.findFirst({
      where: (col, { eq }) => eq(col.id, id),
      with: {
        picture: {
          columns: {},
          with: { file: { columns: { url: true } } },
        },
        options: {
          columns: { text: true, id: true },
          with: {
            picture: {
              columns: {},
              with: { file: { columns: { url: true } } },
            },
          },
        },
        answers: {
          columns: { answerId: true, isAnswer: true },
        },
      },
    });

  const count_ = async (cbtModuleId: string) => {
    const [data] = await db
      .select({ count: count() })
      .from(table)
      .where(
        helper.where((col, { eq, and, isNull }) =>
          and(eq(col.cbtModuleId, cbtModuleId), isNull(col.deletedAt)),
        ),
      );

    return data.count;
  };

  return {
    create,
    update,
    delete: delete_,
    count: count_,
    attach,
    detach,
    findMany,
    findById,
  };
};
