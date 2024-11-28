import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import {
  createCbtModuleSchema,
  updateCbtModuleSchema,
} from "../../../shared/schemas/cbt-module.schema";
import { verifyRole, verifySignedIn } from "../../middlewares/auth-handler";
import { moduleService } from "../../services/cbt-module.service";
import { serveJson } from "../../util/response";

export const cbtModuleRoute = new Hono()
  .use(verifySignedIn())
  .get("/:cbtId/modules", async (c) => {
    const { cbtId } = c.req.param();
    const { data, pagination } = await moduleService(cbtId).findMany();
    return serveJson(c, { data, pagination });
  })
  .post(
    "/:cbtId/modules",
    verifyRole(["admin"]),
    zValidator("json", createCbtModuleSchema),
    async (c) => {
      const { cbtId } = c.req.param();
      const values = c.req.valid("json");
      const { data } = await moduleService(cbtId).create(values);
      return serveJson(c, { data, status: 201 });
    },
  )
  .get("/:cbtId/modules/:cbtModuleId", async (c) => {
    const { cbtId, cbtModuleId } = c.req.param();
    const { data } = await moduleService(cbtId).findById(cbtModuleId);
    return serveJson(c, { data });
  })
  .put(
    "/:cbtId/modules/:moduleId",
    verifyRole(["admin"]),
    zValidator("json", updateCbtModuleSchema),
    async (c) => {
      const { cbtId, moduleId } = c.req.param();
      await moduleService(cbtId).findById(moduleId);
      const values = c.req.valid("json");
      const { data } = await moduleService(cbtId).update(moduleId, values);
      return serveJson(c, { data });
    },
  )
  .delete("/:cbtId/modules/:moduleId", async (c) => {
    const { cbtId, moduleId } = c.req.param();
    await moduleService(cbtId).findById(moduleId);
    await moduleService(cbtId).delete(moduleId);
    return serveJson(c);
  });
