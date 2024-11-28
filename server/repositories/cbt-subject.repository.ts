import { count, eq, getTableColumns, type InferInsertModel } from "drizzle-orm";

import type { CbtSubjectUrlQuery } from "../../shared/query/cbt-subject.query.schema";
import { DB, type Database, type Transaction } from "../db";
import { cbtModules, cbtSubjects } from "../db/schemas";
import { makeDrizzlePgHelper } from "../lib/db";
import { makeCursorQuery } from "../lib/db/cursor";
import { makeSearchQuery } from "../lib/db/search-query";

type Insert = InferInsertModel<typeof cbtSubjects>;
type Update = Partial<Insert>;

export const subjectRepository = () => {
  const db = DB;
  const table = cbtSubjects;
  const helper = makeDrizzlePgHelper(cbtSubjects);
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

  const parseQuery = (query: CbtSubjectUrlQuery) => {
    const { q, limit } = query;

    const { where: cursorWhere, orderBy } = makeCursorQuery(table, {
      primaryCursor: "createdAt",
      orderBy: "name",
      order: "ASC",
    });

    const searchQuery = makeSearchQuery([table.name], q);

    const where = helper.where((col, { and, isNull }) =>
      and(cursorWhere, searchQuery, isNull(col.deletedAt)),
    );

    return { limit, orderBy, where };
  };

  const findMany = (query: CbtSubjectUrlQuery) => {
    const { where, orderBy, limit } = parseQuery(query);
    return db
      .select({
        ...attributes,
        modulesCount: count(cbtModules.id).as("modules_count"),
      })
      .from(table)
      .leftJoin(cbtModules, eq(table.id, cbtModules.cbtSubjectId))
      .where(where)
      .limit(limit)
      .groupBy(table.id)
      .orderBy(...orderBy);
  };

  const findById = (id: string) => {
    return db
      .select({
        ...attributes,
        modulesCount: count(cbtModules.id).as("modules_count"),
      })
      .from(table)
      .leftJoin(cbtModules, eq(table.id, cbtModules.cbtSubjectId))
      .where(
        helper.where((col, { eq, and, isNull }) =>
          and(eq(col.id, id), isNull(col.deletedAt)),
        ),
      )
      .limit(1)
      .groupBy(table.id);
  };

  const count_ = async (query: CbtSubjectUrlQuery) => {
    const { where } = parseQuery(query);

    const [data] = await db
      .select({ count: count() })
      .from(table)
      .where(where)
      .limit(1);

    return data.count;
  };
  return { create, update, delete: delete_, findMany, findById, count: count_ };
};
