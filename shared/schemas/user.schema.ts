import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "../../server/db/schemas";

export const selectUserSchema = createSelectSchema(users);
export const insertUsersSchema = createInsertSchema(users, {
  email: z.string().email(),
});

export const createUserSchema = insertUsersSchema.pick({
  email: true,
  emailVerifiedAt: true,
  passwordHash: true,
  role: true,
});

export const updateUserSchema = createUserSchema
  .omit({
    email: true,
  })
  .partial();

export const assignUserSchema = insertUsersSchema
  .pick({
    email: true,
    role: true,
  })
  .extend({
    password: z.string().trim().min(6),
  });

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUsersSchema>;
export type UserRole = z.infer<typeof selectUserSchema.shape.role>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type AssignUser = z.infer<typeof assignUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
