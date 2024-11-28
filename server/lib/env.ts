import { z } from "zod";

const serveEnv = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
  PORT: z
    .string()
    .regex(/\d+/, "PORT must be a number")
    .default("3000")
    .transform(Number),
  DATABASE_HOST: z.string().default("127.0.0.1"),
  DATABASE_PORT: z
    .string()
    .regex(/^\d+$/, "DATABASE_PORT must be a number")
    .default("5432")
    .transform(Number),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z
    .string()
    .regex(/^\d+$/, "REDIS_PORT must be a number")
    .default("6379")
    .transform(Number),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z
    .string()
    .default("http://localhost:3000/api/auth/sign-in/google/callback"),
  INVITATION_REDIRECT_URL: z
    .string()
    .default("http://localhost:5173/invitations"),
});

export const Env = serveEnv.parse(process.env);
