import { z } from "zod";

import * as schema from "../../db/schemas";

type Tables = keyof typeof schema;

const TABLE_MAP = Object.keys(schema) as unknown as readonly [
  Tables,
  ...Tables[],
];
export const tablesSchema: z.ZodType<Tables> = z.enum(TABLE_MAP);
