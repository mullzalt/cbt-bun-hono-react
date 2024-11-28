import { ilike, or, type SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export function toSqlLike(q?: string) {
  if(!q) return undefined
  return `%${q.replace(/[\s-_]+/g, "%")}%`;
}

export function makeSearchQuery(
  columns: PgColumn[],
  q: string = "",
): SQL | undefined {
  if (!q) {
    return undefined;
  }

  if (!columns.length) {
    return undefined;
  }

  const searchString = q.replace(/[\s-_]+/g, "%");

  const search: SQL[] = columns.map((c) => ilike(c, `%${searchString}%`));

  return or(...search);
}
