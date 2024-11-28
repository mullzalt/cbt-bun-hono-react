import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { cbtModules } from "../../server/db/schemas";

export const selectCbtModuleSchema = createSelectSchema(cbtModules);
export const insertCbtModuleSchema = createInsertSchema(cbtModules);

export const createCbtModuleSchema = insertCbtModuleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  cbtId: true,
});

export const updateCbtModuleSchema = createCbtModuleSchema.partial();

export type CbtModule = z.infer<typeof selectCbtModuleSchema>;
export type CreateCbtModule = z.infer<typeof createCbtModuleSchema>;
export type UpdateCbtModule = z.infer<typeof updateCbtModuleSchema>;
