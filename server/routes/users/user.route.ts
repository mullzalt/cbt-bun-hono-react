import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import { userUrlQuerySchema } from "../../../shared/query/user.query.schema";
import { assignUserSchema } from "../../../shared/schemas/user.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import { verifyRole, verifySignedIn } from "../../middlewares/auth-handler";
import { userRepository } from "../../repositories/user.repository";
import { userService } from "../../services/user.service";
import { serveJson } from "../../util/response";

export const userRoute = new Hono<LuciaContext>()
  .use(verifySignedIn())
  .get(
    "/",
    verifyRole(["admin", "teacher"]),
    zValidator("query", userUrlQuerySchema),
    async (c) => {
      const query = c.req.valid("query");
      const data = await userService().findUsers(query);
      // const { data, pagination } = await userService.paginateByCursor(query);
      return serveJson(c, { data });
    },
  )
  .get("/:userId", verifyRole(["admin", "teacher"]), async (c) => {
    const { userId } = c.req.param();
    const { data } = await userService().findUserById(userId);
    return serveJson(c, { data });
  });
