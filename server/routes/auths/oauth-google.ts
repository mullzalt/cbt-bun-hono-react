import { Hono } from "hono";

import type { LuciaContext } from "../../lib/lucia-context";
import { oauthService } from "../../services/oauth.service";

export const oauthGoogleRoute = new Hono<LuciaContext>()
  .get("/sign-in/google", async (c) => {
    const url = oauthService(c).getGoogleUrl();
    return c.redirect(url);
  })
  .get("/sign-in/google/callback", async (c) => {
    const isSuccess = await oauthService(c).signInGoogle();

    if (!isSuccess) return c.body(null, 400);

    return c.redirect("/");
  });
