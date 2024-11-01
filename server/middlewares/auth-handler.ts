import { createMiddleware } from "hono/factory";

import type { UserRole } from "../../shared/schemas/user.schema";
import type { LuciaContext } from "../lib/lucia-context";
import { ForbiddenError, UnauthorizedError } from "../util/http-error";

export const verifyNotSignedIn = () =>
  createMiddleware<LuciaContext>(async (c, next) => {
    const user = c.get("user");

    if (user) {
      return c.redirect("/");
    }

    await next();
  });

export const verifySignedIn = () =>
  createMiddleware<LuciaContext>(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      throw new UnauthorizedError();
    }

    await next();
  });

export const verifyRole = (roles: UserRole[]) =>
  createMiddleware<LuciaContext>(async (c, next) => {
    const user = c.get("user")!;

    if (!roles.includes(user.role)) {
      throw new ForbiddenError();
    }

    await next();
  });
