import { z } from "zod";

import { users } from "../../server/db/schemas";
import { selectUserSchema } from "../schemas/user.schema";
import { baseUrlQuerySchema, createOrderBySchema } from "./base.query.schema";

export const userOrderBySchema = createOrderBySchema(users, {
  email: true,
  createdAt: true,
});
export const userUrlQuerySchema = baseUrlQuerySchema.extend({
  orderBy: userOrderBySchema,
  role: selectUserSchema.shape.role.default("student"),
});

export type UserUrlQuery = z.infer<typeof userUrlQuerySchema>;
