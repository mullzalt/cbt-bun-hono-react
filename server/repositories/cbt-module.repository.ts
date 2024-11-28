import { count, eq, getTableColumns, type InferInsertModel } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../db";
import { cbtModuleQuestions, cbtModules, cbtSubjects } from "../db/schemas";
import { makeDrizzlePgHelper } from "../lib/db";

type Insert = InferInsertModel<typeof cbtModules>;
type Update = Partial<Insert>;

export const moduleRepository = () => {
  const db = DB;
  const table = cbtModules;
  const helper = makeDrizzlePgHelper(cbtModules);
  const attributes = getTableColumns(table);

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

  const findMany = (cbtId: string) =>
    db.query.cbtModules.findMany({
      where: (col, { eq, and, isNull }) =>
        and(eq(col.cbtId, cbtId), isNull(col.deletedAt)),
      with: {
        subject: { columns: { name: true } },
        questions: { columns: { id: true } },
      },
    });

  // const findMany = (cbtId: string) =>
  //   db
  //     .select({
  //       ...attributes,
  //       subject: cbtSubjects.name,
  //       questionCount: count(cbtModuleQuestions.id),
  //     })
  //     .from(table)
  //     .leftJoin(cbtSubjects, eq(cbtSubjects.id, table.cbtSubjectId))
  //     .leftJoin(
  //       cbtModuleQuestions,
  //       eq(cbtModuleQuestions.cbtModuleId, table.id),
  //     )
  //     .groupBy(table.id, cbtSubjects.name)
  //     .where(
  //       helper.where((col, { eq, and, isNull }) =>
  //         and(eq(col.cbtId, cbtId), isNull(col.deletedAt)),
  //       ),
  //     );

  const findById = (id: string) =>
    db
      .select({ ...attributes, subject: cbtSubjects.name })
      .from(table)
      .leftJoin(cbtSubjects, eq(cbtSubjects.id, table.cbtSubjectId))
      .where(
        helper.where((col, { eq, and, isNull }) =>
          and(eq(col.id, id), isNull(col.deletedAt)),
        ),
      );

  const count_ = async (cbtId: string) => {
    const [data] = await db
      .select({ count: count() })
      .from(table)
      .where(
        helper.where((col, { eq, and, isNull }) =>
          and(eq(col.cbtId, cbtId), isNull(col.deletedAt)),
        ),
      );

    return data.count;
  };

  return {
    create,
    update,
    delete: delete_,
    count: count_,
    findMany,
    findById,
  };
};
