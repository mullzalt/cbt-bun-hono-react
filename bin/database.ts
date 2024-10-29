import { parseArgs } from "util";

import { Client } from "pg";

import { config } from "@/lib/config";
import { logger } from "@/lib/logger";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    action: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { url: _, name, ...db } = config.database;

const client = new Client({
  ...db,
});

async function isDbExist() {
  await client.connect();

  const res = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${name}';`,
  );

  if (res.rowCount !== 0) {
    return true;
  }

  return false;
}

async function createDB() {
  if (await isDbExist()) {
    logger.info(
      `Database ${name} already existed, skipping database creation.`,
    );
    await client.end();
    return process.exit(0);
  }

  logger.info(`Creating database...`);
  await client.query(`CREATE DATABASE ${name};`).catch((err) => {
    logger.error(`Failed to create database, ${err?.message}`);
    return process.exit(1);
  });

  await client.end();
  logger.info(`Database '${name}' successfully created.`);
  return process.exit(0);
}

async function deleteDB() {
  if (!(await isDbExist())) {
    logger.info(`Database ${name} not exist, skipping database deletion.`);
    return process.exit(0);
  }

  logger.info(`Deleting database...`);
  await client.query(`DROP DATABASE ${name};`).catch((err) => {
    logger.error(`Failed to delete database, ${err?.message}`);
    return process.exit(1);
  });

  await client.end();
  logger.info(`Database '${name}' successfully deleted.`);
  return process.exit(0);
}

async function main(action: string | undefined) {
  switch (action) {
    case "create": {
      await createDB();
      return;
    }
    case "delete": {
      await deleteDB();
      return;
    }
    default: {
      logger.warn(`unknown argument ${action}`);
      logger.warn(`use either "create" or "delete"`);
      return;
    }
  }
}

main(values.action);
