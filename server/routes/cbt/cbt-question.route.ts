import { Hono } from "hono";

import { zValidator } from "@hono/zod-validator";

import {
  createModuleQuestionSchema,
  setAnswerSchema,
} from "../../../shared/schemas/cbt-module-question.schema";
import { verifySignedIn } from "../../middlewares/auth-handler";
import { optionService } from "../../services/cbt-question-option.service";
import { questionService } from "../../services/cbt-question.service";
import { serveJson } from "../../util/response";

export const cbtQuestionRoute = new Hono()
  .use(verifySignedIn())
  .get("/:moduleId/questions", async (c) => {
    const { moduleId } = c.req.param();
    const { data, pagination } = await questionService(moduleId).findMany();
    return serveJson(c, { data, pagination });
  })
  .post(
    "/:moduleId/questions",
    zValidator("form", createModuleQuestionSchema),
    async (c) => {
      const { moduleId } = c.req.param();
      const value = c.req.valid("form");

      await questionService(moduleId).create(value);
      const { data, pagination } = await questionService(moduleId).findMany();

      return serveJson(c, {
        data,
        pagination,
      });
    },
  )
  .put(
    "/:moduleId/questions/:questionId",
    zValidator("form", createModuleQuestionSchema),
    async (c) => {
      const { moduleId, questionId } = c.req.param();
      const value = c.req.valid("form");

      await questionService(moduleId).update(questionId, value);
      const { data, pagination } = await questionService(moduleId).findMany();

      return serveJson(c, {
        data,
        pagination,
      });
    },
  )
  .delete("/:moduleId/questions/:questionId", async (c) => {
    const { moduleId, questionId } = c.req.param();
    await questionService(moduleId).delete(questionId);
    const { data, pagination } = await questionService(moduleId).findMany();

    return serveJson(c, {
      data,
      pagination,
    });
  })
  .post(
    "/:moduleId/questions/:questionId/answer",
    zValidator("form", setAnswerSchema),
    async (c) => {
      const { moduleId, questionId } = c.req.param();
      const { answerId } = c.req.valid("form");
      await questionService(questionId).setAnswer({ questionId, answerId });
      const { data, pagination } = await questionService(moduleId).findMany();

      return serveJson(c, {
        data,
        pagination,
      });
    },
  )
  .post(
    "/:moduleId/questions/:questionId/options",
    zValidator("form", createModuleQuestionSchema),
    async (c) => {
      const { moduleId, questionId } = c.req.param();
      const value = c.req.valid("form");
      await optionService(questionId).create(value);
      const { data, pagination } = await questionService(moduleId).findMany();

      return serveJson(c, {
        data,
        pagination,
      });
    },
  )
  .put(
    "/:moduleId/questions/:questionId/options/:optionId",
    zValidator("form", createModuleQuestionSchema),
    async (c) => {
      const { moduleId, questionId, optionId } = c.req.param();
      const value = c.req.valid("form");
      await optionService(questionId).update(optionId, value);
      const { data, pagination } = await questionService(moduleId).findMany();

      return serveJson(c, {
        data,
        pagination,
      });
    },
  )
  .delete("/:moduleId/questions/:questionId/options/:optionId", async (c) => {
    const { moduleId, questionId, optionId } = c.req.param();
    await optionService(questionId).delete(optionId);
    const { data, pagination } = await questionService(moduleId).findMany();

    return serveJson(c, {
      data,
      pagination,
    });
  });
