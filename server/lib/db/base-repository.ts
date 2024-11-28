import {
  getTableColumns,
  getTableName,
  ne,
  SQL,
  type InferSelectModel,
} from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import { generateCursor, type Cursor } from "drizzle-cursor";

import type { Database } from "../../db";
import {
  drizzleOrderByOperations,
  drizzleSelectOperations,
} from "../drizzle-helper";

type CursorPaginationOption<TColumns extends PgTable["_"]["columns"]> = {
  primaryCursor: keyof TColumns & string;
  order: "ASC" | "DESC";
  orderBy: (keyof TColumns & string)[];
};

type SearchQueryOption<TColumns extends PgTable["_"]["columns"]> = {
  q?: string;
  columns: (keyof TColumns & string)[];
};

abstract class BaseRepository<
  TTable extends PgTable,
  TColumns extends TTable["_"]["columns"] = TTable["_"]["columns"],
  TTableName extends TTable["_"]["name"] = TTable["_"]["name"],
  TData extends InferSelectModel<TTable> = InferSelectModel<TTable>,
> {
  public columns: TColumns;
  public tableName: TTableName;
  constructor(
    protected db: Database,
    protected table: TTable,
  ) {
    this.columns = getTableColumns(table) as TColumns;
    this.tableName = getTableName(table) as TTableName;
  }

  protected _where(
    callback: (
      fields: TColumns,
      operators: typeof drizzleSelectOperations,
    ) => SQL | undefined,
  ): SQL | undefined {
    return callback(this.columns, drizzleSelectOperations);
  }

  protected _orderBy(
    callback: (
      fields: TColumns,
      operators: typeof drizzleOrderByOperations,
    ) => SQL<unknown>[],
  ): SQL<unknown>[] {
    return callback(this.columns, drizzleOrderByOperations);
  }

  protected _prepareCursorPaginationQuery(
    option: CursorPaginationOption<TColumns> & {
      lastPreviousData?: TData;
      primaryKey: keyof TColumns & string;
    },
  ) {
    const { lastPreviousData, primaryKey, ...other } = option;
    const { and } = drizzleSelectOperations;

    const lastPreviousDataPrimaryKey = lastPreviousData
      ? lastPreviousData[primaryKey]
      : undefined;

    const noDuplicateId = ne(
      this.columns[primaryKey],
      lastPreviousDataPrimaryKey,
    ).if(Boolean(lastPreviousDataPrimaryKey));

    const { where, orderBy } = this.$prepareCursorPaginatonQuery({ ...other });
    return {
      where: and(where(lastPreviousData), noDuplicateId),
      orderBy,
    };
  }

  protected _prepareSearchQuery({
    q,
    columns = [],
  }: SearchQueryOption<TColumns>) {
    if (!q) return undefined;
    const { ilike, or } = drizzleSelectOperations;
    const search = columns.map((c) =>
      ilike(this.columns[c], `%${q.replace(/[\s-_]+/g, "%")}%`),
    );
    return or(...search);
  }

  private $prepareCursorPaginatonQuery(
    option: CursorPaginationOption<TColumns>,
  ) {
    const { primaryCursor, order, orderBy = [] } = option;
    const cursors: Cursor[] = orderBy.flatMap((col) => ({
      schema: this.columns[col],
      key: col,
      order,
    }));

    return generateCursor({
      primaryCursor: {
        schema: this.columns[primaryCursor],
        key: primaryCursor,
        order,
      },
      cursors,
    });
  }
}

export { BaseRepository };
