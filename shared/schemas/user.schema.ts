import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "../../server/db/schemas";

export const selectUserSchema = createSelectSchema(users);
export const insertUsersSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().trim().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .regex(
      /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/,
      "Invalid Indonesian phone number",
    ),
});

export const createUserSchema = insertUsersSchema.pick({
  name: true,
  email: true,
  phoneNumber: true,
  emailVerifiedAt: true,
  passwordHash: true,
  image: true,
});

export const updateUserSchema = createUserSchema
  .omit({
    email: true,
  })
  .partial();

export type User = z.infer<typeof selectUserSchema>;
export type UserRole = z.infer<typeof selectUserSchema.shape.role>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
