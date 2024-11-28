import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { attachments } from "../db/schemas";
import { Repository } from "../lib/repository";

type Attachment = InferSelectModel<typeof attachments>;

type InsertAttachment = Omit<
  InferInsertModel<typeof attachments>,
  "id" | "createdAt" | "updatedAt"
>;

type UpdateAttachment = Partial<InsertAttachment>;

class AttachmentFileRepository extends Repository<
  typeof attachments,
  Attachment,
  InsertAttachment,
  Partial<InferInsertModel<typeof attachments>>
> {
  constructor() {
    super(attachments);
  }

  async findById(id: string) {
    const [data] = await this.db
      .select()
      .from(this.table)
      .where(this._matchId(id));
    if (!data) return undefined;
    return data;
  }

  async create(values: InsertAttachment) {
    const [data] = await this.db.insert(this.table).values(values).returning();
    return data;
  }

  async update(id: string, values: UpdateAttachment) {
    const [data] = await this.db
      .update(this.table)
      .set(values)
      .where(this._matchId(id))
      .returning();
    return data;
  }

  async delete(id: string) {
    const [data] = await this.db
      .delete(this.table)
      .where(this._matchId(id))
      .returning();
    return data;
  }
}

export { AttachmentFileRepository };
