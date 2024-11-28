import { z } from "zod";

import { cbtSubjects } from "../../server/db/schemas";
import { baseUrlQuerySchema, createOrderBySchema } from "./base.query.schema";

export const cbtSubjectOrderBySchema = createOrderBySchema(cbtSubjects, {
  name: true,
  createdAt: true,
});

export const cbtSubjectUrlQuerySchema = baseUrlQuerySchema.extend({
  orderBy: cbtSubjectOrderBySchema.default("createdAt"),
});

export type CbtSubjectUrlQuery = z.infer<typeof cbtSubjectUrlQuerySchema>;
