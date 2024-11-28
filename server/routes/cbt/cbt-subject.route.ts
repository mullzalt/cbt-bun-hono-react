import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import { cbtSubjectUrlQuerySchema } from "../../../shared/query/cbt-subject.query.schema";
import {
  createCbtSubjectSchema,
  updateCbtSubjectSchema,
} from "../../../shared/schemas/cbt-subject.schema";
import type { LuciaContext } from "../../lib/lucia-context";
import { verifyRole, verifySignedIn } from "../../middlewares/auth-handler";
import { subjectService } from "../../services/cbt-subject.service";
import { serveJson } from "../../util/response";

export const cbtSubjectRoute = new Hono<LuciaContext>()
  .use(verifySignedIn())
  .get("/", zValidator("query", cbtSubjectUrlQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { data, pagination } = await subjectService().paginate(query);
    return serveJson(c, { data, pagination });
  })
  .post(
    "/",
    verifyRole(["admin"]),
    zValidator("json", createCbtSubjectSchema),
    async (c) => {
      const values = c.req.valid("json");
      const { data: subject } = await subjectService().create(values);
      const { data } = await subjectService().findById(subject.id);

      return serveJson(c, { data, status: 201 });
    },
  )
  .put(
    "/:subjectId",
    verifyRole(["admin"]),
    zValidator("json", updateCbtSubjectSchema),
    async (c) => {
      const { subjectId } = c.req.param();
      const values = c.req.valid("json");
      await subjectService().update(subjectId, values);

      const data = await subjectService().findById(subjectId);

      return serveJson(c, { data });
    },
  )
  .delete("/:subjectId", verifyRole(["admin"]), async (c) => {
    const { subjectId } = c.req.param();
    await subjectService().delete(subjectId);
    return serveJson(c);
  });
