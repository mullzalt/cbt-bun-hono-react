import { getTableColumns, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import { DB } from "../db";
import { drizzleSelectOperations } from "./drizzle-helper";

export abstract class Repository<
  TData = unknown,
  TCreate = unknown,
  TUpdate = unknown,
  TTable extends PgTable = PgTable,
  TColumn extends TTable["_"]["columns"] = TTable["_"]["columns"],
> {
  protected table: TTable;
  protected db: typeof DB;
  private _columns: TColumn;

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

  findMany?(): Promise<TData[]>;
  delete?(id: string): Promise<boolean>;
  findById?(id: string): Promise<TData | null>;
  create?(values: TCreate): Promise<TData>;
  update?(id: string, values: TUpdate): Promise<TData | null>;
}
