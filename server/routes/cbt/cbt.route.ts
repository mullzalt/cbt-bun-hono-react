import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import { cbtUrlQuerySchema } from "../../../shared/query/cbt.query.schema";
import {
  createCbtSchema,
  updateCbtSchema,
} from "../../../shared/schemas/cbt.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import { verifyRole, verifySignedIn } from "../../middlewares/auth-handler";
import { cbtService } from "../../services/cbt.service";
import { serveJson } from "../../util/response";

export const cbtRoute = new Hono<LuciaContext>()
  .use(verifySignedIn())
  .get("/", zValidator("query", cbtUrlQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { data, pagination } = await cbtService().paginate(query);
    return serveJson(c, { data, pagination });
  })
  .post(
    "/",
    verifyRole(["admin"]),
    zValidator("json", createCbtSchema),
    async (c) => {
      const values = c.req.valid("json");
      const { data } = await cbtService().create(values);

      return serveJson(c, { data, status: 201 });
    },
  )
  .get("/:cbtId", async (c) => {
    const { cbtId } = c.req.param();
    const { data } = await cbtService().findById(cbtId);

    return serveJson(c, { data });
  })
  .put(
    "/:cbtId",
    verifyRole(["admin"]),
    zValidator("json", updateCbtSchema),
    async (c) => {
      const values = c.req.valid("json");
      const { cbtId } = c.req.param();
      const { data } = await cbtService().update(cbtId, values);

      return serveJson(c, { data });
    },
  )
  .delete(
    "/:cbtId",
    verifyRole(["admin"]),
    zValidator("json", updateCbtSchema),
    async (c) => {
      const { cbtId } = c.req.param();
      await cbtService().delete(cbtId);

      return serveJson(c);
    },
  );
