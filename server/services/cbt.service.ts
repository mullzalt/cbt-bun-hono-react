import type { CbtUrlQuery } from "../../shared/query/cbt.query.schema";
import type { CreateCbt, UpdateCbt } from "../../shared/schemas/cbt.schema";
import { getPaginationOption } from "../lib/db/cursor";
import { cbtRepository } from "../repositories/cbt.repository";
import { NotFoundError, UnhandledError } from "../util/http-error";

export const cbtService = () => {
  const repo = cbtRepository();

  const paginate = async (query: CbtUrlQuery) => {
    const data = await repo.findMany(query);
    const count = await repo.count(query);
    const pagination = getPaginationOption({
      data,
      count,
      limit: query.limit,
      primaryKey: "id",
    });

    return { data, pagination };
  };

  const create = async (value: CreateCbt) => {
    const [cbt] = await repo.create(value).returning();
    const data = await repo.findById(cbt.id);
    if (!data) throw new UnhandledError();
    return { data };
  };

  const update = async (id: string, value: UpdateCbt) => {
    const [cbt] = await repo.update(id, value).returning();
    const data = await repo.findById(cbt.id);
    if (!data) throw new UnhandledError();
    return { data };
  };

  const delete_ = async (id: string) => {
    return await repo.delete(id);
  };

  const findById = async (id: string) => {
    const data = await repo.findById(id);
    if (!data) throw new NotFoundError();
    return { data };
  };

  return {
    paginate,
    create,
    findById,
    update,
    delete: delete_,
  };
};
