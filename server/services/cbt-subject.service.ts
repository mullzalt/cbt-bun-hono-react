import type { CbtSubjectUrlQuery } from "../../shared/query/cbt-subject.query.schema";
import type {
  CreateCbtSubject,
  UpdateCbtSubject,
} from "../../shared/schemas/cbt-subject.schema";
import { getPaginationOption } from "../lib/db/cursor";
import { subjectRepository } from "../repositories/cbt-subject.repository";
import { NotFoundError } from "../util/http-error";

export const subjectService = () => {
  const repo = subjectRepository();

  const paginate = async (query: CbtSubjectUrlQuery) => {
    const { limit } = query;

    const data = await repo.findMany(query);
    const count = await repo.count(query);
    const pagination = getPaginationOption({
      data,
      count,
      limit,
      primaryKey: "id",
    });

    return { data, pagination };
  };

  const findById = async (id: string) => {
    const [data] = await repo.findById(id);

    if (!data) throw new NotFoundError("not_found");

    return { data };
  };

  const create = async (value: CreateCbtSubject) => {
    const [data] = await repo.create(value).returning();

    return { data };
  };

  const update = async (id: string, value: UpdateCbtSubject) => {
    const [data] = await repo.update(id, value).returning();

    return { data };
  };

  const delete_ = async (id: string) => {
    return await repo.delete(id);
  };

  return {
    paginate,
    findById,
    create,
    update,
    delete: delete_,
  };
};
