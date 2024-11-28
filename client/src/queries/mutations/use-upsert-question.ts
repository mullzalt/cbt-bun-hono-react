import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { arrayMove } from "@dnd-kit/sortable";
import { produce } from "immer";
import { toast } from "sonner";

import { QuestionForm } from "@/shared/schemas/cbt-module-question.schema";

import {
  CbtQuestionsResponse,
  deleteQuestion,
  updateQuestion,
} from "../cbt-question";

export function useUpsertQuestion({
  cbtId,
  cbtModuleId,
}: {
  cbtId: string;
  cbtModuleId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "cbts",
    "cbt",
    "modules",
    "questions",
    { cbtId, cbtModuleId },
  ];

  return useMutation({
    mutationFn: async (value: QuestionForm) =>
      await updateQuestion({ cbtModuleId, cbtId, ...value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtQuestionsResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
        const { id: _, text = "" } = value;
        const image = "";
        if (value.id) {
          const dataIndex = draft.data.map((d) => d.id).indexOf(value.id);
          const prev = draft.data[dataIndex];
          draft.data[dataIndex] = { ...prev, text };
        }

        if (!value.id) {
          draft.data.push({
            id: "uuid",
            cbtModuleId,
            text,
            image,
            options: [],
            createdAt: "",
            updatedAt: "",
            deletedAt: null,
          });
        }
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

export function useDeleteQuestion({
  cbtId,
  cbtModuleId,
}: {
  cbtId: string;
  cbtModuleId: string;
}) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = [
    "cbts",
    "cbt",
    "modules",
    "questions",
    { cbtId, cbtModuleId },
  ];

  return useMutation({
    mutationFn: async (questionId: string) =>
      await deleteQuestion({ cbtModuleId, cbtId, questionId }),
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
