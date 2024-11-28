import { logger } from "../lib/logger";
import { cbtModuleSeeder } from "./seeder/cbt-module.seeder";
import { cbtSubjectSeeder } from "./seeder/cbt-subject.seeder";
import { cbtSeeder } from "./seeder/cbt.seeder";
import { userSeeder } from "./seeder/user.seeder";

async function main() {
  logger.info("Seeding database...");
  //call function

  await userSeeder.clean();
  await userSeeder.seed(20);

  // await cbtSubjectSeeder.clean();
  // await cbtSeeder.clean();
  //
  // const cbts = await cbtSeeder.seed(10);
  //
  // const subjects = await cbtSubjectSeeder.seed(5);
  //
  // await cbtModuleSeeder.clean();
  // for (const cbt of cbts) {
  //   for (const subject of subjects) {
  //     await cbtModuleSeeder.seed(1, {
  //       cbtId: cbt.id,
  //       cbtSubjectId: subject.id,
  //     });
  //   }
  // }

  logger.info("seeding done!");
  process.exit();
}

main();
