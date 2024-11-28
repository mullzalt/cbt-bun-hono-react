import { InferRequestType } from "hono";
import { notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

import {
  CreateModuleQuestion,
  QuestionForm,
} from "@/shared/schemas/cbt-module-question.schema";
import { ResponseError } from "@/shared/types/response";
import { ArrayElement, AsyncReturnType } from "@/shared/types/util";
import { api, createFetcher } from "@/lib/api";

export const getQuestions = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions.$get,
);

export const createQuestion = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions.$post,
);

export const updateQuestion = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].$put,
);

export const deleteQuestion = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].$delete,
);

export const createOption = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].options
    .$post,
);

export const updateOption = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].options[
    ":optionId"
  ].$put,
);

export const deleteOption = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].options[
    ":optionId"
  ].$delete,
);

export const setAnswer = createFetcher(
  api.cbts[":cbtId"].modules[":moduleId"].questions[":questionId"].answer.$post);

export const cbtQuestionsQueryOption = ({
  cbtId,
  moduleId,
}: {
  cbtId: string;
  moduleId: string;
}) =>
  queryOptions({
    queryKey: ["cbts", "cbt", "modules", "questions", { cbtId, moduleId }],
    queryFn: () => getQuestions({ param: { cbtId, moduleId } }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export type CbtQuestionsResponse = AsyncReturnType<typeof getQuestions>;
export type CbtQuestion = ArrayElement<CbtQuestionsResponse["data"]>;
