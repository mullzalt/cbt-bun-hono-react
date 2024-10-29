import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono();

app.use(cors());
app.use(logger());
app.use(compress());
app.use(trimTrailingSlash());

export { app };
