import { sql, type SQL } from "drizzle-orm";

export type ConditionQuery<T extends string> = { when: SQL; then: T };

export function caseQuery<T extends string>(conds: ConditionQuery<T>[], el: T) {
  const chunks: SQL[] = [];

  chunks.push(sql`case`);

  function makeCondition(when: SQL, then: T) {
    return sql.join(
      [sql`when`, when, sql`then`, sql.raw(`'${then}'`)],
      sql.raw(" "),
    );
  }

  conds.map(({ when, then }) => chunks.push(makeCondition(when, then)));

  chunks.push(sql`else`);
  chunks.push(sql.raw(`'${el}'`));
  chunks.push(sql`end`);

  return sql.join(chunks, sql.raw(" ")) as SQL<T>;
}
