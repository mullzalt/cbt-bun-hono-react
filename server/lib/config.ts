import { Env } from "./env";

export const config = {
  port: Env.PORT,
  database: {
    host: Env.DATABASE_HOST,
    port: Env.DATABASE_PORT,
    user: Env.DATABASE_USER,
    password: Env.DATABASE_PASSWORD,
    name: Env.DATABASE_NAME,
    url: `postgres://${Env.DATABASE_USER}:${Env.DATABASE_PASSWORD}@${Env.DATABASE_HOST}:${Env.DATABASE_PORT}/${Env.DATABASE_NAME}`,
  },
  worker: {
    host: Env.REDIS_HOST,
    port: Env.REDIS_PORT,
  },
  auth: {
    google: {
      clientId: Env.GOOGLE_CLIENT_ID,
      clientSecret: Env.GOOGLE_CLIENT_SECRET,
      redirectUrl: Env.GOOGLE_REDIRECT_URL,
    },
  },
  invitation: {
    url: (token: string) => [Env.INVITATION_REDIRECT_URL, token].join("/"),
  },
};
