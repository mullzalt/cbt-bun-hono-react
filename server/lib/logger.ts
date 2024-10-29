import pino from "pino";

import { Env } from "./env";

const logger = pino({
  level: Env.LOG_LEVEL || "info",
});

export { logger };
