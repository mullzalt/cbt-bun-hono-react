import { z } from "zod";

const urlQuerySearchSchema = z.string().optional();
const urlQueryOrderSchema = z.enum(["ASC", "DESC"]).default("DESC");
const urlQueryCursorSchema = z.string().optional();
const urlQueryLimintSchema = z.coerce.number().gt(0).default(10);

export const baseUrlQuerySchema = z.object({
  q: urlQuerySearchSchema,
  order: urlQueryOrderSchema,
  cursor: urlQueryCursorSchema,
  limit: urlQueryLimintSchema,
});
