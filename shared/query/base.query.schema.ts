import { z } from "zod";
import { getTableColumns } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

export const urlQuerySearchSchema = z.string().optional();
export const urlQueryOrderSchema = z.enum(["ASC", "DESC"]).default("DESC");
export const urlQueryCursorSchema = z.string().optional();
export const urlQueryLimintSchema = z.coerce.number().gt(0).default(10);

export const baseUrlQuerySchema = z.object({
  q: urlQuerySearchSchema,
  order: urlQueryOrderSchema,
  cursor: urlQueryCursorSchema,
  limit: urlQueryLimintSchema,
});

export const createOrderBySchema = <
  TTable extends PgTable,
  TCol extends TTable["_"]["columns"],
  K extends keyof TCol,
  TSelect extends { [Key in K]?: true } | undefined,
  TSelected extends TSelect extends undefined
    ? K & string
    : { [Key in keyof TSelect]: Key }[keyof TSelect] & string,
>(
  table: TTable,
  select?: TSelect,
) => {
  const selected = (
    select ? Object.keys(select) : Object.keys(getTableColumns(table))
  ) as TSelected[];
  return z.enum<TSelected, [TSelected, ...TSelected[]]>(
    selected as [TSelected, ...TSelected[]],
  );
};

export type UrlQueryOrder = z.infer<typeof urlQueryOrderSchema>;
export type BaseUrlQuery = z.infer<typeof baseUrlQuerySchema>;
