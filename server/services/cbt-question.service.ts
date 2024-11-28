import type { CreateModuleQuestion } from "../../shared/schemas/cbt-module-question.schema";
import { DB } from "../db";
import { questionRepository } from "../repositories/cbt-module-question.repository";
import { questionHasAnswerRepository } from "../repositories/question-has-answer-repository";

export const questionService = (cbtModuleId: string) => {
  const repo = questionRepository();

  const answerRepo = questionHasAnswerRepository();
  const db = DB;

  const findMany = async () => {
    const data = await repo.findMany(cbtModuleId);
    const count = await repo.count(cbtModuleId);

    return { data, pagination: { count } };
  };

  const create = async (value: CreateModuleQuestion) => {
    const { file, text = "" } = value;

    const [data] = await repo.create({ text, cbtModuleId }).returning();

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

  const setAnswer = async ({
    questionId,
    answerId,
  }: {
    questionId: string;
    answerId: string;
  }) => {
    await db.transaction(async (tx) => {
      const where = answerRepo.helper.where((col, { ne, eq, and }) =>
        and(eq(col.questionId, questionId), ne(col.answerId, answerId)),
      );

      await answerRepo
        .upsert({ questionId, answerId, isAnswer: true }, tx)
        .returning();

      await answerRepo.update({ isAnswer: false }, tx).where(where).returning();
    });
  };

  return { findMany, create, update, delete: delete_, setAnswer };
};
