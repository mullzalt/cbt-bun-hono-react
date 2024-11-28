import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

import * as schema from "../../server/db/schemas";
import { arrayOrderable } from "../../server/db/schemas";

type Tables = keyof typeof schema;

const TABLE_MAP = Object.keys(schema) as unknown as readonly [
  Tables,
  ...Tables[],
];
const tablesSchema: z.ZodType<Tables> = z.enum(TABLE_MAP);

export const createArrayOrderableSchema = createInsertSchema(arrayOrderable, {
  referenceType: tablesSchema,
  orderable: tablesSchema,
});

export const selectArrayOrderableSchema = createInsertSchema(arrayOrderable, {
  referenceType: tablesSchema,
  orderable: tablesSchema,
});

export const arrayOrderableOptions = selectArrayOrderableSchema.pick({
  referenceType: true,
  orderable: true,
});

export type ArrayOrderableOption = z.infer<typeof arrayOrderableOptions>;

export type ArrayOrderable = z.infer<typeof selectArrayOrderableSchema>;

export type CreateOrUpdateArrayOrderable = z.infer<
  typeof createArrayOrderableSchema
>;
