import {
  and,
  arrayContained,
  arrayContains,
  arrayOverlaps,
  asc,
  between,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notIlike,
  notInArray,
  notLike,
  or,
  SQL,
  sql,
  type ValueOrArray,
} from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import type { Database, Transaction } from "../../db";

const drizzleSelectOperations = {
  and,
  arrayContained,
  arrayContains,
  arrayOverlaps,
  between,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notIlike,
  notInArray,
  notLike,
  or,
  sql,
};

const drizzleOrderByOperations = {
  asc,
  desc,
  sql,
};

export type DrizzleSelectOperations = typeof drizzleSelectOperations;
export type DrizzleOrderOperations = typeof drizzleOrderByOperations;

const makeDrizzlePgHelper = <
  TTable extends PgTable,
  TCol extends TTable["_"]["columns"],
>(
  table: TTable,
) => {
  const columns = getTableColumns(table) as TCol;

  const where = (
    callback: (
      columns: TCol,
      operations: DrizzleSelectOperations,
    ) => SQL | undefined,
  ) => callback(columns, drizzleSelectOperations);

  const orderBy = (
    callback: (
      columns: TCol,
      operations: DrizzleOrderOperations,
    ) => ValueOrArray<SQL>,
  ) => callback(columns, drizzleOrderByOperations);

  const _count = (tx: Transaction | Database) =>
    tx.select({ count: count().as("count") }).from(table);

  return {
    columns,
    where,
    orderBy,
    count: _count,
  };
};

export {
  drizzleSelectOperations,
  drizzleOrderByOperations,
  makeDrizzlePgHelper,
};
