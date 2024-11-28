import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  lt,
  ne,
  or,
  SQL,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { DB } from "../../db";
import type { PgTableWithId } from "./type";

const ORDER = {
  ASC: {
    orderFn: asc,
    operationFn: gt,
  },
  DESC: {
    orderFn: desc,
    operationFn: lt,
  },
};

type MakeCursorOptions<
  TTable extends PgTableWithId,
  TId extends TTable["id"] = TTable["id"],
  TIdType extends TId["_"]["data"] = TId["_"]["data"],
  TColumn extends TTable["_"]["columns"] = TTable["_"]["columns"],
  TKey extends keyof TColumn = keyof TColumn,
> = {
  primaryCursor: TKey;
  order?: "ASC" | "DESC";
  orderBy?: keyof TColumn;
  cursor?: TIdType;
};

export function makeCursorQuery<TTable extends PgTableWithId>(
  table: TTable,
  options: MakeCursorOptions<TTable>,
) {
  const db = DB;
  const { primaryCursor, orderBy, order = "DESC", cursor } = options;
  const { orderFn, operationFn } = ORDER[order];
  const columns = getTableColumns(table);

  const columnKey = orderBy ? orderBy : primaryCursor;
  const selectedColumn = (
    orderBy ? columns[orderBy] : columns[primaryCursor]
  ) as PgColumn;
  const primaryColumn = columns[primaryCursor] as PgColumn;

  const orderBys: SQL<unknown>[] = [
    orderFn(selectedColumn),
    orderFn(primaryColumn),
  ];

  let cursorWhere: SQL<unknown> | undefined = undefined;

  if (cursor) {
    const compareQuery = db
      .select({ [columnKey]: selectedColumn })
      .from(table)
      .where(eq(table.id, cursor));
    const primaryCompareQuery = db
      .select({ [primaryCursor]: primaryColumn })
      .from(table)
      .where(eq(table.id, cursor));

    cursorWhere = and(
      or(
        operationFn(selectedColumn, compareQuery),
        and(
          eq(selectedColumn, compareQuery),
          operationFn(primaryColumn, primaryCompareQuery),
        ),
      ),
      ne(table.id, cursor),
    );
  }

  return {
    orderBy: orderBys,
    where: cursorWhere,
  };
}

type Pagination<T> = {
  count: number;
  cursor?: T | undefined;
};

export function getPaginationOption<
  D extends Record<string, unknown>,
  K extends keyof D = keyof D,
>(options: {
  data: D[];
  limit: number;
  primaryKey: K;
  count: number;
}): Pagination<D[K]> {
  const { data, limit, primaryKey, count } = options;
  const last = data.at(-1);

  if (data.length <= count) {
    return { count };
  }

  if (data.length < limit) {
    return { count };
  }

  if (!last) {
    return { count };
  }

  return { count, cursor: last[primaryKey] };
}
