import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { isMobilePhone } from "validator";

import { userProfiles, userStudentProfiles } from "../../server/db/schemas";
import { getRandomColorHex } from "../../server/lib/utils/random-color";

const profileMetadataSchema = z.object({
  colorFallback: z.string().default(getRandomColorHex()),
});

const selectProfileSchema = createSelectSchema(userProfiles, {
  metadata: profileMetadataSchema,
});
const insertProfileSchema = createInsertSchema(userProfiles, {
  name: z.string().trim().min(1, { message: "required" }),
  phoneNumber: z.string().refine((s) => isMobilePhone(s, "id-ID")),
  metadata: profileMetadataSchema,
});

const insertStudentProfileSchema = createInsertSchema(userStudentProfiles, {
  parentPhoneNumber: z.string().refine((s) => isMobilePhone(s, "id-ID")),
  grade: z.string().trim().min(1, { message: "required" }),
  school: z.string().trim().min(1, { message: "required" }),
  targetUniversity: z.string().trim().min(1, { message: "required" }),
  address: z.string().trim().min(1, { message: "required" }),
});

export const upsertProfileSchema = insertProfileSchema
  .pick({
    name: true,
  })
  .extend({
    phoneNumber: z
      .string()
      .refine((s) => isMobilePhone(s, "id-ID"))
      .optional(),
  });

export const createStudentProfileSchema = insertProfileSchema
  .required()
  .pick({
    name: true,
  })
  .merge(
    insertStudentProfileSchema
      .omit({
        userId: true,
        createdAt: true,
        updatedAt: true,
      })
      .required(),
  )
  .extend({
    phoneNumber: z.string().refine((s) => isMobilePhone(s, "id-ID")),
  });

export type ProfileMetadata = z.infer<typeof profileMetadataSchema>;
export type Profile = z.infer<typeof selectProfileSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type CreateStudentProfile = z.infer<typeof createStudentProfileSchema>;
export type UpsertProfile = z.input<typeof upsertProfileSchema>;
