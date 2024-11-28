import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import {
  createPasswordSchema,
  signInSchema,
} from "../../../shared/schemas/auth.schema";
import {
  createStudentProfileSchema,
  upsertProfileSchema,
} from "../../../shared/schemas/profile.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import { verifySignedIn } from "../../middlewares/auth-handler";
import { authService } from "../../services/auth.service";
import { profileService } from "../../services/profile.service";
import { serveJson } from "../../util/response";

export const authRoute = new Hono<LuciaContext>()
  .post("/sign-in", zValidator("form", signInSchema), async (c) => {
    const values = c.req.valid("form");
    await authService(c).signIn(values);
    return serveJson(c);
  })

  .get("/sign-out", async (c) => {
    await authService(c).signOut();
    return serveJson(c);
  })

  .get("/info", verifySignedIn(), async (c) => {
    const { data, metadata } = await authService(c).getUserInfo();
    return serveJson(c, { data, metadata });
  })
  .post(
    "/password",
    verifySignedIn(),
    zValidator("form", createPasswordSchema),
    async (c) => {
      const value = c.req.valid("form");

      await authService(c).createPassword(value);

      const { data, metadata } = await authService(c).getUserInfo();
      return serveJson(c, { data, metadata });
    },
  )
  .post(
    "/profile",
    verifySignedIn(),
    zValidator("form", upsertProfileSchema),
    async (c) => {
      const value = c.req.valid("form");

      await profileService(c).upsertProfile(value);

      const { data, metadata } = await authService(c).getUserInfo();
      return serveJson(c, { data, metadata });
    },
  )
  .post(
    "/student-profile",
    verifySignedIn(),
    zValidator("form", createStudentProfileSchema),
    async (c) => {
      const value = c.req.valid("form");

      await profileService(c).createStudentProfile(value);

      const { data, metadata } = await authService(c).getUserInfo();
      return serveJson(c, { data, metadata });
    },
  );
