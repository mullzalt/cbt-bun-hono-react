import { HTTPException } from "hono/http-exception";

import {
  createArrayOrderableSchema,
  type ArrayOrderable,
  type CreateOrUpdateArrayOrderable,
} from "../../shared/schemas/array-orderable.schema";
import { ArrayOrderableRepository } from "../repositories/array-orderable.repository";

class ArrayOrderableService {
  repo;
  constructor() {
    this.repo = new ArrayOrderableRepository();
  }

  async createOrUpdate(value: CreateOrUpdateArrayOrderable) {
    const parsed = createArrayOrderableSchema.safeParse(value);

    if (!parsed.success) {
      throw new HTTPException(422, { ...parsed.error });
    }

    const data = await this.repo.createOrUpdate(value);
    return { data };
  }

  async find(value: Omit<ArrayOrderable, "ids">) {
    const data = await this.repo.find(value);
    if (!data) return { data: { ids: [] } };
    return { data };
  }
}

export const arrayOrderableService = new ArrayOrderableService();
