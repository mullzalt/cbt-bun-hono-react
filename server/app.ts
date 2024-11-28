import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { appLogger } from "./lib/logger";
import type { LuciaContext } from "./lib/lucia-context";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { sessionHandler } from "./middlewares/session-handler";
import {
  authRoute,
  cbtModuleRoute,
  cbtQuestionRoute,
  cbtRoute,
  cbtSubjectRoute,
  invitationRoute,
  oauthGoogleRoute,
  userRoute,
} from "./routes";

const app = new Hono<LuciaContext>();

app.use(logger(appLogger));
app.use(trimTrailingSlash());

app.use("*", cors(), sessionHandler());

const appRoute = app
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/auth", oauthGoogleRoute)
  .route("/users", userRoute)
  .route("/cbts", cbtRoute)
  .route("/cbts", cbtModuleRoute)
  .route("/cbts/:cbtId/modules", cbtQuestionRoute)
  .route("/subjects", cbtSubjectRoute)
  .route("/invitations", invitationRoute);

app.onError(errorHandler());
app.notFound(notFoundHandler());

app.use("/static/*", serveStatic({ root: "./" }));

export type Api = typeof appRoute;

export { app, appRoute };
