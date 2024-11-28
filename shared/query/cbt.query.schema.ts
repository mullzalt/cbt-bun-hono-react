import { z } from "zod";

import { cbts } from "../../server/db/schemas";
import { baseUrlQuerySchema, createOrderBySchema } from "./base.query.schema";

export const cbtOrderBySchema = createOrderBySchema(cbts, {
  name: true,
  createdAt: true,
});

export const cbtStatusSchema = z.enum([
  "unpublished",
  "published",
  "ongoing",
  "closed",
]);

export const cbtUrlQuerySchema = baseUrlQuerySchema.extend({
  orderBy: cbtOrderBySchema.default("createdAt"),
  status: cbtStatusSchema.optional(),
});

export type CbtUrlQuery = z.infer<typeof cbtUrlQuerySchema>;
export type CbtStatus = z.infer<typeof cbtStatusSchema>;
