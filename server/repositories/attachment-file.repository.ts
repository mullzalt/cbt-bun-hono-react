import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { attachmentFiles } from "../db/schemas";
import { Repository } from "../lib/repository";

type AttachmentFile = InferSelectModel<typeof attachmentFiles>;

type InsertAttachmentFile = Omit<
  InferInsertModel<typeof attachmentFiles>,
  "id" | "createdAt" | "updatedAt"
>;

type UpdateAttachmentFile = Partial<InsertAttachmentFile>;

class AttachmentFileRepository extends Repository<
  typeof attachmentFiles,
  AttachmentFile,
  InsertAttachmentFile,
  Partial<InferInsertModel<typeof attachmentFiles>>
> {
  constructor() {
    super(attachmentFiles);
  }

  async findById(id: string) {
    const [data] = await this.db
      .select()
      .from(this.table)
      .where(this._matchId(id));
    if (!data) return undefined;
    return data;
  }

  async create(values: InsertAttachmentFile) {
    const [data] = await this.db.insert(this.table).values(values).returning();
    return data;
  }

  async update(id: string, values: UpdateAttachmentFile) {
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
