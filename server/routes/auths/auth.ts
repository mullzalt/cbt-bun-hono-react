import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import { signInSchema } from "../../../shared/schemas/auth.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import {
  verifyNotSignedIn,
  verifySignedIn,
} from "../../middlewares/auth-handler";
import { authService } from "../../services/auth.service";
import { serveJson } from "../../util/response";

export const authRoute = new Hono<LuciaContext>()
  .post(
    "/sign-in",
    verifyNotSignedIn(),
    zValidator("json", signInSchema),
    async (c) => {
      const values = c.req.valid("json");
      const sessionCookie = await authService.signIn(values);
      c.header("Set-Cookie", sessionCookie, { append: true });

      return serveJson(c);
    },
  )

  .get("/sign-out", async (c) => {
    const session = c.get("session");
    const redirect = c.req.query("redirect") || "/";
    const blankSessionCookie = await authService.signOut(session);
    c.header("Set-Cookie", blankSessionCookie);
    return c.redirect(redirect);
  })

  .get("/info", verifySignedIn(), async (c) => {
    const user = c.get("user")!;
    return serveJson(c, { data: user });
  })
  .post("/password", verifySignedIn());
