import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import {
  acceptInvitationSchema,
  invitationUrlQuerySchema,
} from "../../../shared/schemas/invitation.schema";
import { insertUsersSchema } from "../../../shared/schemas/user.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import { verifyRole, verifySignedIn } from "../../middlewares/auth-handler";
import { invitationService } from "../../services/user-invitation.service";
import { serveJson } from "../../util/response";

export const invitationRoute = new Hono<LuciaContext>()
  .get(
    "/",
    verifySignedIn(),
    verifyRole(["admin"]),
    zValidator("query", invitationUrlQuerySchema),
    async (c) => {
      const query = c.req.valid("query");
      const { data, pagination } =
        await invitationService(c).getsPagination(query);
      return serveJson(c, { data, pagination });
    },
  )
  .post(
    "/",
    verifySignedIn(),
    verifyRole(["admin"]),
    zValidator("form", insertUsersSchema.pick({ role: true })),
    async (c) => {
      const { role } = c.req.valid("form");
      const { data } = await invitationService(c).create(role);

      return serveJson(c, { data });
    },
  )
  .delete(
    "/:invitationId",
    verifySignedIn(),
    verifyRole(["admin"]),
    async (c) => {
      const { invitationId } = c.req.param();

      await invitationService(c).delete(invitationId);

      return serveJson(c);
    },
  )
  .get("/:token", async (c) => {
    const { token } = c.req.param();

    const { data } = await invitationService(c).get(token);

    return serveJson(c, { data });
  })
  .post("/:token", zValidator("form", acceptInvitationSchema), async (c) => {
    const { email } = c.req.valid("form");
    const { token } = c.req.param();

    await invitationService(c).accept({ token, email });

    return serveJson(c);
  });
