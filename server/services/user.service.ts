import type { UserUrlQuery } from "../../shared/query/user.query.schema";
import { getPaginationOption } from "../lib/db/cursor";
import { userRepository } from "../repositories/user.repository";
import { NotFoundError } from "../util/http-error";

export const userService = () => {
  const repo = userRepository();

  const findUsers = async (query: UserUrlQuery) => {
    const data = await repo.getUsers(query);
    const count = await repo.count(query);
    const pagination = getPaginationOption({
      data,
      count,
      limit: query.limit,
      primaryKey: "id",
    });

    return { data, pagination };
  };

  const findUserById = async (id: string) => {
    const data = await repo.findById(id);

    if (!data) {
      throw new NotFoundError("not_found");
    }

    return { data };
  };

  return {
    findUsers,
    findUserById,
  };
};
