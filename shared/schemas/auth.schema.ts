import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type SignIn = z.infer<typeof signInSchema>;
