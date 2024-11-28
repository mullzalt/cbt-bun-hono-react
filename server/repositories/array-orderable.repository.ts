import type {
  ArrayOrderable,
  CreateOrUpdateArrayOrderable,
} from "../../shared/schemas/array-orderable.schema";
import { arrayOrderable } from "../db/schemas";
import { Repository } from "../lib/repository";

class ArrayOrderableRepository extends Repository<
  typeof arrayOrderable,
  ArrayOrderable,
  CreateOrUpdateArrayOrderable
> {
  constructor() {
    super(arrayOrderable);
  }

  async find(value: Omit<ArrayOrderable, "ids">) {
    const { referenceId, referenceType, orderable } = value;

    const where = this.where((col, { eq, and }) =>
      and(
        eq(col.referenceType, referenceType),
        eq(col.orderable, orderable),
        eq(col.referenceId, referenceId),
      ),
    );

    const [data] = await this.db.select().from(this.table).where(where);
    if (!data) return undefined;
    return data as ArrayOrderable;
  }

  async createOrUpdate(value: CreateOrUpdateArrayOrderable) {
    const { referenceId, referenceType, orderable, ids } = value;

    const [data] = await this.db
      .insert(this.table)
      .values({
        referenceId,
        referenceType,
        orderable,
        ids,
      })
      .onConflictDoUpdate({
        target: [
          this.table.referenceId,
          this.table.orderable,
          this.table.referenceType,
        ],
        set: { ids },
      })
      .returning();

    return data as ArrayOrderable;
  }
}

export { ArrayOrderableRepository };
