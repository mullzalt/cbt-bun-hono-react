import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { appLogger } from "./lib/logger";
import type { LuciaContext } from "./lib/lucia-context";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { sessionHandler } from "./middlewares/session-handler";
import { routes } from "./routes";

const app = new Hono<LuciaContext>();

app.use(logger(appLogger));
app.use(trimTrailingSlash());

app.use("*", cors(), sessionHandler());

app.onError(errorHandler());
app.notFound(notFoundHandler());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRoute = app.route("/api", routes);

export type Api = typeof appRoute;

export { app };
