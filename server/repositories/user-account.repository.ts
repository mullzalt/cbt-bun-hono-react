import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { userAccounts } from "../db/schemas";
import { Repository } from "../lib/repository";

export class UserAccountRepository extends Repository<
  InferSelectModel<typeof userAccounts>,
  InferInsertModel<typeof userAccounts>,
  InferInsertModel<typeof userAccounts>,
  typeof userAccounts
> {
  constructor() {
    super(userAccounts);
  }

  async create(values: {
    userId: string;
    provider: string;
    providerUserId: string;
  }) {
    const [data] = await this.db
      .insert(this.table)
      .values(values)
      .onConflictDoUpdate({
        target: [this.table.userId, this.table.providerUserId],
        set: { provider: values.provider },
      })
      .returning();
    return data;
  }
}
