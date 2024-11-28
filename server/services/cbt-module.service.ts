import type {
  CreateCbtModule,
  UpdateCbtModule,
} from "../../shared/schemas/cbt-module.schema";
import { moduleRepository } from "../repositories/cbt-module.repository";
import { cbtRepository } from "../repositories/cbt.repository";
import { BadRequestError, NotFoundError } from "../util/http-error";

export const moduleService = (cbtId: string) => {
  const repo = moduleRepository();

  const beforeSelect = async () => {
    const data = await cbtRepository().findById(cbtId);
    if (!data) throw new NotFoundError("not_found");
    return { cbt: data };
  };

  const beforeAction = async () => {
    const { cbt } = await beforeSelect();
    if (cbt.status !== "unpublished") {
      throw new BadRequestError("cbt_published");
    }
  };

  const findMany = async () => {
    await beforeSelect();
    const data = await repo.findMany(cbtId);
    const count = await repo.count(cbtId);
    const pagination = {
      count,
    };

    const transformed = data.map(({ questions, subject, ...other }) => ({
      ...other,
      subject: subject.name,
      questions: { count: questions.length },
    }));

    return { data: transformed, pagination };
  };

  const findById = async (id: string) => {
    await beforeSelect();
    const [data] = await repo.findById(id);

    if (!data) throw new NotFoundError("not_found");

    return { data };
  };

  const create = async (value: Omit<CreateCbtModule, "cbtId">) => {
    await beforeAction();
    const [data] = await repo.create({ ...value, cbtId }).returning();

    return { data };
  };

  const update = async (id: string, value: UpdateCbtModule) => {
    await beforeAction();
    const [data] = await repo.update(id, value).returning();

    return { data };
  };

  const delete_ = async (id: string) => {
    await beforeAction();
    return await repo.delete(id);
  };

  return { findMany, findById, create, update, delete: delete_ };
};
