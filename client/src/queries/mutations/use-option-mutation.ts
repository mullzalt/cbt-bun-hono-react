import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { produce } from "immer";
import { toast } from "sonner";

import { QuestionForm } from "@/shared/schemas/cbt-module-question.schema";

import {
  CbtQuestionsResponse,
  createOption,
  deleteOption,
  updateOption,
} from "../cbt-question";

export function useCreateOption({
  cbtId,
  cbtModuleId,
  questionId,
}: {
  cbtId: string;
  cbtModuleId: string;
  questionId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "cbts",
    "cbt",
    "modules",
    "questions",
    { cbtId, moduleId: cbtModuleId },
  ];

  return useMutation({
    mutationFn: async (value: QuestionForm) =>
      await createOption({
        param: { moduleId: cbtModuleId, questionId },
        form: value,
      }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtQuestionsResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
        const { text = "" } = value;

        const dataIndex = draft.data.map((d) => d.id).indexOf(questionId);

        draft.data[dataIndex].options.push({
          id: "uuid",
          text: "",
          picture: { file: { url: "" } },
        });
      });
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, updatedData);

      return { prevData };
    },
    onSuccess: (res) => {
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, res);
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
    onError: (error, _, context) => {
      toast.error("Failed to update question:" + error.message);
      if (context?.prevData) {
        queryClient.setQueryData<CbtQuestionsResponse>(
          queryKey,
          context.prevData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });
}

export function useUpdateOption({
  cbtId,
  cbtModuleId,
  questionId,
}: {
  cbtId: string;
  cbtModuleId: string;
  questionId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "cbts",
    "cbt",
    "modules",
    "questions",
    { cbtId, moduleId: cbtModuleId },
  ];

  return useMutation({
    mutationFn: async ({
      optionId,
      value,
    }: {
      optionId: string;
      value: QuestionForm;
    }) =>
      await updateOption({
        param: { moduleId: cbtModuleId, questionId, optionId },
        form: value,
      }),
    onMutate: async ({ optionId, value }) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtQuestionsResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
        const { text = "" } = value;

        const questionIndex = draft.data.map((d) => d.id).indexOf(questionId);
        const question = draft.data[questionIndex];
        const optionIndex = question.options.map((d) => d.id).indexOf(optionId);
        const prev = question.options[optionIndex];
        draft.data[questionIndex].options[optionIndex] = { ...prev, text };
      });
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, updatedData);

      return { prevData };
    },
    onSuccess: (res) => {
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, res);
    },
    onError: (error, _, context) => {
      toast.error("Failed to update question:" + error.message);
      if (context?.prevData) {
        queryClient.setQueryData<CbtQuestionsResponse>(
          queryKey,
          context.prevData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });
}

export function useDeleteOption({
  cbtId,
  cbtModuleId,
  questionId,
}: {
  cbtId: string;
  cbtModuleId: string;
  questionId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "cbts",
    "cbt",
    "modules",
    "questions",
    { cbtId, moduleId: cbtModuleId },
  ];

  return useMutation({
    mutationFn: async (optionId: string) =>
      await deleteOption({
        param: { moduleId: cbtModuleId, questionId, optionId },
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtQuestionsResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
        draft.data.filter((data) => data.id !== id);
      });
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, updatedData);

      return { prevData };
    },
    onSuccess: (res) => {
      queryClient.setQueryData<CbtQuestionsResponse>(queryKey, res);
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
    onError: (error, _, context) => {
      toast.error("Failed to delete question:" + error.message);
      if (context?.prevData) {
        queryClient.setQueryData<CbtQuestionsResponse>(
          queryKey,
          context.prevData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });
}
