import { app } from "./app";
import { pool } from "./db";
import { config } from "./lib/config";
import { Env } from "./lib/env";
import { logger } from "./lib/logger";

const server = Bun.serve({
  fetch: app.fetch,
  port: config.port,
});

logger.info(`Server is running on ${server.url.origin}, env: ${Env.NODE_ENV}`);

process.on("SIGINT", async () => {
  await pool.end();
  server.stop(true);
  logger.info("Exiting...");
  process.exit(0);
});
