import {
  and,
  gt,
  isNotNull,
  isNull,
  lt,
  sql,
  type InferInsertModel,
  type SQL,
} from "drizzle-orm";

import type {
  CbtStatus,
  CbtUrlQuery,
} from "../../shared/query/cbt.query.schema";
import { DB, type Database, type Transaction } from "../db";
import { cbts } from "../db/schemas";
import { caseQuery, makeDrizzlePgHelper } from "../lib/db";
import { makeCursorQuery } from "../lib/db/cursor";
import { makeSearchQuery } from "../lib/db/search-query";

type Insert = InferInsertModel<typeof cbts>;
type Update = Partial<Insert>;

export const cbtRepository = () => {
  const table = cbts;
  const db = DB;
  const helper = makeDrizzlePgHelper(cbts);

  const statusWhereQuery: Record<CbtStatus, SQL<unknown> | undefined> = {
    unpublished: isNull(table.publishedAt),
    published: and(
      isNotNull(table.publishedAt),
      gt(table.openedAt, sql`now()`),
    ),
    ongoing: and(
      isNotNull(table.publishedAt),
      lt(table.openedAt, sql`now()`),
      gt(table.closedAt, sql`now()`),
    ),
    closed: and(isNotNull(table.publishedAt), lt(table.closedAt, sql`now()`)),
  };

  const statusQuery = caseQuery<CbtStatus>(
    [
      { when: statusWhereQuery.unpublished!, then: "unpublished" },
      { when: statusWhereQuery.published!, then: "published" },
      { when: statusWhereQuery.ongoing!, then: "ongoing" },
      { when: statusWhereQuery.closed!, then: "closed" },
    ],
    "unpublished",
  );

  const parseUrlQuery = (query: CbtUrlQuery) => {
    const { limit, status } = query;
    const { where: cursorWhere, orderBy } = makeCursorQuery(table, {
      primaryCursor: "createdAt",
      orderBy: query.orderBy,
      order: query.order,
      cursor: query.cursor,
    });

    const searchQuery = makeSearchQuery([table.name], query.q);

    const where = and(
      cursorWhere,
      status ? statusWhereQuery[status] : undefined,
      searchQuery,
    );

    return { orderBy, limit, where };
  };

  const create = (value: Insert, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);

  const update = (id: string, value: Update, tx: Transaction | Database = db) =>
    tx
      .update(table)
      .set(value)
      .where(helper.where((col, { eq }) => eq(col.id, id)));

  const delete_ = (id: string) =>
    db
      .update(table)
      .set({
        deletedAt: new Date(),
      })
      .where(helper.where((col, { eq }) => eq(col.id, id)));

  const findMany = (query: CbtUrlQuery) => {
    const { orderBy, where, limit } = parseUrlQuery(query);

    return db.query.cbts.findMany({
      where,
      orderBy,
      limit,
      extras: {
        status: statusQuery.as("status"),
      },
    });
  };

  const findById = (id: string) =>
    db.query.cbts.findFirst({
      where: (col, { eq }) => eq(col.id, id),
      extras: {
        status: statusQuery.as("status"),
      },
    });

  const count = async (query: CbtUrlQuery) => {
    const { where } = parseUrlQuery(query);
    const [data] = await helper.count(db).where(where).limit(1);

    return data.count;
  };

  return {
    helper,
    create,
    update,
    delete: delete_,
    findMany,
    findById,
    count,
  };
};
