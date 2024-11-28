import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export const createPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "password_not_match",
      });
    }
  });

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    password: z.string().trim().min(6),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "password_not_match",
      });
    }
  });

export type SignIn = z.infer<typeof signInSchema>;
export type CreatePassword = z.infer<typeof createPasswordSchema>
export type UpdatePassword = z.infer<typeof updatePasswordSchema>
