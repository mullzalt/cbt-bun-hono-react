import { Hono } from "hono";

import type { LuciaContext } from "../../lib/lucia-context";
import { verifyNotSignedIn } from "../../middlewares/auth-handler";
import { authService } from "../../services/auth.service";

export const oauthGoogleRoute = new Hono<LuciaContext>()
  .use(verifyNotSignedIn())
  .get("/sign-in/google", async (c) => {
    const url = await authService.setGoogleState(c);
    return c.redirect(url);
  })
  .get("/sign-in/google/callback", async (c) => {
    const isSuccess = await authService.signInGoogle(c);

    if (!isSuccess) return c.body(null, 400);

    return c.redirect("/");
  });
