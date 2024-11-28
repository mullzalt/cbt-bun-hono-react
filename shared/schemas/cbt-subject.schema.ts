import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { cbtSubjects } from "../../server/db/schemas";

export const selectCbtSubjectSchema = createSelectSchema(cbtSubjects);
export const insertCbtSubjectSchema = createInsertSchema(cbtSubjects, {
  name: z.string().trim().min(1, "Required"),
});

export const createCbtSubjectSchema = insertCbtSubjectSchema.pick({
  name: true,
});

export const updateCbtSubjectSchema = createCbtSubjectSchema.partial();

export type CbtSubject = z.infer<typeof selectCbtSubjectSchema>;
export type CreateCbtSubject = z.infer<typeof createCbtSubjectSchema>;
export type UpdateCbtSubject = z.infer<typeof updateCbtSubjectSchema>;
