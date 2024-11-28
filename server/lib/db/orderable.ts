import { z } from "zod";
import { sql, SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { DB } from "../../db";
import { arrayOrderable } from "../../db/schemas";
import { tablesSchema } from "./tables";

const selectArrayOrderableSchema = createInsertSchema(arrayOrderable, {
  referenceType: tablesSchema,
  orderable: tablesSchema,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arrayOrderableOptions = selectArrayOrderableSchema.pick({
  referenceType: true,
  orderable: true,
});

export type ArrayOrderableOption = z.infer<typeof arrayOrderableOptions>;

class ArrayOrderable {
  constructor(private options: ArrayOrderableOption) {}

  async find(referenceId: string) {
    const { orderable, referenceType } = this.options;
    const data = await DB.query.arrayOrderable.findFirst({
      where(col, { eq, and }) {
        return and(
          eq(col.orderable, orderable),
          eq(col.referenceId, referenceId),
          eq(col.referenceType, referenceType),
        );
      },
    });
    if (!data) return [];
    return data.ids;
  }

  async upsert(referenceId: string, ids: string[]) {
    const [data] = await DB.insert(arrayOrderable)
      .values({ ...this.options, referenceId, ids })
      .onConflictDoUpdate({
        target: [
          arrayOrderable.referenceId,
          arrayOrderable.orderable,
          arrayOrderable.referenceType,
        ],
        set: { ids },
      })
      .returning();
    return data.ids;
  }

  orderBy<TCol extends PgColumn, TType extends TCol["_"]["data"]>(
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

export function createArrayOrderable(options: ArrayOrderableOption) {
  return new ArrayOrderable(options);
}
