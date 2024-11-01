import type {
  CreateUser,
  UpdateUser,
  User,
} from "../../shared/schemas/user.schema";
import { users } from "../db/schemas";
import { Repository } from "../lib/repository";

export class UserRepository extends Repository<
  User,
  CreateUser,
  UpdateUser,
  typeof users
> {
  constructor() {
    super(users);
  }

  async findById(id: string) {
    const [data] = await this.db
      .select()
      .from(this.table)
      .where(this._matchId(id));
    if (!data) return null;
    return data;
  }

  async findByEmail(email: string) {
    const matchEmail = this.where(({ email: _email }, { eq }) =>
      eq(_email, email),
    );
    const [data] = await this.db.select().from(this.table).where(matchEmail);
    if (!data) return null;
    return data;
  }

  async create(values: CreateUser) {
    const { emailVerifiedAt } = values; // eslint-disable-line @typescript-eslint/no-unused-vars
    const [data] = await this.db
      .insert(this.table)
      .values(values)
      .onConflictDoUpdate({
        target: this.table.email,
        set: { emailVerifiedAt },
      })
      .returning();
    return data;
  }

  async update(id: string, values: UpdateUser) {
    const prev = await this.findById(id);
    if (!prev) return null;
    const [data] = await this.db
      .update(this.table)
      .set(values)
      .where(this._matchId(id))
      .returning();
    return data;
  }

  private _matchId(id: string) {
    return this.where(({ id: _id }, { eq }) => eq(_id, id));
  }
}
