import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

import { appLogger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";

const app = new Hono();

app.use(cors());
app.use(logger(appLogger));
app.use(trimTrailingSlash());

app.onError(errorHandler());
app.notFound(notFoundHandler());

export { app };
