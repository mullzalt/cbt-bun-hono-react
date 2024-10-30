import pino from "pino";

import { Env } from "./env";

const logger = pino({
  level: Env.LOG_LEVEL || "info",
});

const appLogger = (message: string, ...rest: string[]) => {
  logger.info(message, ...rest);
};

export { logger, appLogger };
