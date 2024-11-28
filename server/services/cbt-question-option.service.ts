import type { CreateModuleQuestion } from "../../shared/schemas/cbt-module-question.schema";
import { optionRepository } from "../repositories/cbt-module-question-option.repository";

export const optionService = (questionId: string) => {
  const repo = optionRepository();

  const create = async (value: CreateModuleQuestion) => {
    const { file, text = "" } = value;

    const [data] = await repo
      .create({ text, cbtModuleQuestionId: questionId })
      .returning();

    if (file) {
      await repo.attach(data.id, file);
    }

    return { data };
  };

  const update = async (id: string, value: CreateModuleQuestion) => {
    const { file, text } = value;

    const [data] = await repo.update(id, { text }).returning();

    if (file === null) {
      await repo.detach(id);
    }

    if (file) {
      await repo.attach(id, file);
    }

    return { data };
  };

  const delete_ = async (id: string) => {
    await repo.detach(id);
    return await repo.delete(id);
  };

  return { create, update, delete: delete_ };
};
