import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { cbts } from "../../server/db/schemas";

export const selectCbtSchema = createSelectSchema(cbts);

export const insertCbtSchema = createInsertSchema(cbts, {
  name: z.string().trim().min(1, "Required"),
  openedAt: z.coerce.date(),
  closedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
});

export const createCbtSchema = insertCbtSchema.pick({
  name: true,
});

export const updateCbtSchema = insertCbtSchema
  .pick({
    name: true,
    publishedAt: true,
    openedAt: true,
    closedAt: true,
    description: true,
  })
  .superRefine(({ openedAt, closedAt, publishedAt }, ctx) => {
    if ((!openedAt || !closedAt) && publishedAt) {
      ctx.addIssue({
        code: "custom",
        message: "add open and close datetime before publishing",
        path: ["publishedAt"],
      });
    }

    if (!openedAt || !closedAt) {
      return;
    }

    if (openedAt >= closedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["openedAt"],
        message: "open at must be before close at",
      });
      ctx.addIssue({
        code: "custom",
        path: ["closedAt"],
        message: "close at must be after open at",
      });
    }
  });

export type Cbt = z.infer<typeof selectCbtSchema>;
export type CreateCbt = z.infer<typeof createCbtSchema>;
export type UpdateCbt = z.infer<typeof updateCbtSchema>;
