import pino from "pino";
import { PinoPretty } from "pino-pretty";

import { Env } from "./env";

const stream =
  Env.NODE_ENV === "production"
    ? undefined
    : PinoPretty({
        colorize: true,
      });

const logger = pino(
  {
    level: Env.LOG_LEVEL || "info",
  },
  stream,
);

const appLogger = (message: string, ...rest: string[]) => {
  logger.info(message, ...rest);
};

export { logger, appLogger };
