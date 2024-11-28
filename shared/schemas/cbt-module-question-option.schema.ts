import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { cbtModuleQuestionOptions } from "../../server/db/schemas";
import { fileSize } from "../../server/lib/file-size";
import { createUploadSchema } from "../../server/lib/uploader/zod-validation";

export const selectModuleQuestionOptionSchema = createSelectSchema(
  cbtModuleQuestionOptions,
);

export const insertModuleQuestionOptionSchema = createInsertSchema(
  cbtModuleQuestionOptions,
  {
    isAnswer: z
      .enum(["true", "false"])
      .optional()
      .default("false")
      .transform((v) => (v === "true" ? true : false)),
  },
);

const fileSchema = createUploadSchema({
  maxSize: fileSize.Mb(2),
  mimeTypes: ["image/png", "image/jpeg", "image/webp"],
});

export const createModuleQuestionOptionSchema = insertModuleQuestionOptionSchema
  .pick({
    id: true,
    text: true,
    isAnswer: true,
  })
  .extend({
    file: fileSchema,
    detachFile: z
      .enum(["true", "false"])
      .optional()
      .default("false")
      .transform((v) => (v === "true" ? true : false)),
  });

export type ModuleQuestionOption = z.infer<
  typeof selectModuleQuestionOptionSchema
>;
export type InsertModuleQuestionOption = z.infer<
  typeof selectModuleQuestionOptionSchema
>;
export type CreateModuleQuestionOption = z.infer<
  typeof createModuleQuestionOptionSchema
>;
export type OptionsForm = z.input<typeof createModuleQuestionOptionSchema>;
