import {
  count,
  getTableColumns,
  sql,
  type InferInsertModel,
  type InferSelectModel,
  type SQL,
} from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

import { generateCursor, type Cursor } from "drizzle-cursor";

import { DB } from "../db";
import {
  // drizzleOrderByOperations,
  drizzleSelectOperations,
} from "./drizzle-helper";

type PaginateByCursorOption<TOrderBy> = {
  primaryCursor: TOrderBy;
  order: "ASC" | "DESC";
  orderBy?: TOrderBy[];
};

export abstract class Repository<
  TTable extends PgTable = PgTable,
  TData = InferSelectModel<TTable>,
  TCreate = InferInsertModel<TTable>,
  TUpdate = Partial<InferInsertModel<TTable>>,
  TColumn extends TTable["_"]["columns"] = TTable["_"]["columns"],
> {
  protected table: TTable;
  protected db: typeof DB;
  protected _columns: TColumn;

  constructor(table: TTable) {
    this.table = table;
    this.db = DB;
    this._columns = getTableColumns(table) as TColumn;
  }

  protected where(
    callback: (
      fields: TColumn,
      operators: typeof drizzleSelectOperations,
    ) => SQL | undefined,
  ): SQL | undefined {
    return callback(this._columns, drizzleSelectOperations);
  }

  async count(
    callback?: (
      fields: TColumn,
      operators: typeof drizzleSelectOperations,
    ) => SQL | undefined,
  ) {
    const where = callback
      ? callback(this._columns, drizzleSelectOperations)
      : undefined;

    const [data] = await this.db
      .select({ count: count() })
      .from(this.table)
      .where(where)
      .limit(1);

    return data.count;
  }

  protected paginateByCursorQuery(
    options: PaginateByCursorOption<keyof TColumn>,
  ) {
    const { primaryCursor, order, orderBy = [] } = options;
    const cursors: Cursor[] = orderBy.flatMap((col) => ({
      schema: this._columns[col as string],
      key: col as string,
      order,
    }));

    const { where, orderBy: _orderBy } = generateCursor({
      primaryCursor: {
        schema: this._columns[primaryCursor as string],
        key: primaryCursor as string,
        order,
      },
      cursors,
    });

    return { where, orderBy: _orderBy };
  }

  protected getPaginationCursor<
    D extends TData = TData,
    K extends keyof D = keyof D,
  >(options: { data: D[]; limit: number; primaryKey: K }): D[K] | undefined {
    const { data, limit, primaryKey } = options;
    const last = data.at(-1);

    if (data.length < limit) {
      return undefined;
    }

    if (last) {
      return last[primaryKey];
    }

    return undefined;
  }

  protected stringSearchQuery(q: string = "", columns: (keyof TColumn)[] = []) {
    if (!q) return undefined;
    const { ilike, or } = drizzleSelectOperations;
    const search = columns.map((c) =>
      ilike(this._columns[c], `%${q.replace(/[\s-_]+/g, "%")}%`),
    );
    return or(...search);
  }

  findMany?(): Promise<TData[]>;
  delete?(id: string): Promise<TData>;
  findById?(id: string): Promise<TData | undefined>;
  create?(values: TCreate): Promise<TData>;
  update?(id: string, values: TUpdate): Promise<TData>;

  protected _matchId(id: string) {
    return this.where(({ id: _id }, { eq }) => (_id ? eq(_id, id) : undefined));
  }

  protected _notMatchId(id?: string) {
    if (!id) return undefined;
    return this.where(({ id: _id }, { ne }) => (_id ? ne(_id, id) : undefined));
  }

  protected _notDeleted() {
    return this.where(({ deletedAt }, { isNull }) =>
      deletedAt ? isNull(deletedAt) : undefined,
    );
  }

  protected _orderByArray<
    TCol extends PgColumn,
    TType extends TCol["_"]["data"],
  >(col: TCol, array: TType[]) {
    const chunks: SQL[] = [];
    chunks.push(sql`case ${col}`);
    array.map((a, i) => {
      chunks.push(sql` when ${a} then ${i + 1} `);
    });
    chunks.push(sql` else 999`);
    chunks.push(sql` end`);
    return sql.join(chunks);
  }

  protected _orderByIds<TCol extends PgColumn, TType extends TCol["_"]["data"]>(
    col: TCol,
    ids: TType[],
  ) {
    if (ids.length < 1) {
      return [] as SQL[];
    }
    const chunks: SQL[] = [];
    chunks.push(sql`array_position(ARRAY[`);
    ids.map((id, i) => {
      if (i + 1 === ids.length) {
        chunks.push(sql`${id}`);
        return;
      }
      chunks.push(sql`${id},`);
    });
    chunks.push(sql`]::uuid[], ${col})`);
    return [sql.join(chunks)];
  }
}
