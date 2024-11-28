/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";

export type PgTableWithId = PgTableWithColumns<{
  dialect: "pg";
  columns: {
    id: PgColumn<
      {
        name: any;
        tableName: any;
        dataType: any;
        columnType: any;
        data: any;
        driverParam: any;
        notNull: true;
        hasDefault: boolean;
        enumValues: any;
        baseColumn: any;
        isPrimaryKey: any;
        isAutoincrement: any;
        hasRuntimeDefault: any;
        generated: any;
      },
      object
    >;
  };
  schema: any;
  name: any;
}>;
