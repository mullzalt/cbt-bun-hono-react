import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { cbtModuleQuestions } from "../../server/db/schemas";
import { fileSize } from "../../server/lib/file-size";
import { createUploadSchema } from "../../server/lib/uploader/zod-validation";

export const selectModuleQuestionSchema =
  createSelectSchema(cbtModuleQuestions);

export const insertModuleQuestionSchema =
  createInsertSchema(cbtModuleQuestions);

const fileSchema = createUploadSchema({
  maxSize: fileSize.Mb(2),
  mimeTypes: ["image/png", "image/jpeg", "image/webp"],
});

export const createModuleQuestionSchema = insertModuleQuestionSchema
  .pick({
    text: true,
  })
  .extend({
    file: fileSchema,
  });

export const setAnswerSchema = z.object({
  answerId: z.string().uuid()
})

export type ModuleQuestion = z.infer<typeof selectModuleQuestionSchema>;
export type InsertModuleQuestion = z.infer<typeof selectModuleQuestionSchema>;
export type CreateModuleQuestion = z.infer<typeof createModuleQuestionSchema>;
export type QuestionForm = z.input<typeof createModuleQuestionSchema>;
