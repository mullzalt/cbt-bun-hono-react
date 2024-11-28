import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { arrayMove } from "@dnd-kit/sortable";
import { produce } from "immer";

import {
  CbtModulesResponse,
  sortCbtModules,
  SortCbtModulesResponse,
} from "../cbt-module";

export function useSortCbtModules({ cbtId }: { cbtId: string }) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["cbts", "cbt", "modules", { cbtId }];

  return useMutation({
    mutationFn: async ({
      data,
      activeIndex,
      overIndex,
    }: {
      data: CbtModulesResponse["data"];
      activeIndex: number;
      overIndex: number;
    }) => {
      const movedData = arrayMove(data, activeIndex, overIndex);
      const ids: string[] = movedData.flatMap((d) => d.id);
      return await sortCbtModules({ cbtId, ids });
    },
    onMutate: async ({ activeIndex, overIndex }) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtModulesResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
        draft.data = arrayMove(draft.data, activeIndex, overIndex);
      });
      queryClient.setQueryData<CbtModulesResponse>(queryKey, updatedData);

      return { prevData };
    },
    onSuccess: (res) => {
      queryClient.setQueryData<SortCbtModulesResponse>(
        queryKey,
        produce((draft) => {
          if (!draft) return undefined;
          draft.data = res.data;
        }),
      );
    },
    onError: (error, _, context) => {
      if (context?.prevData) {
        queryClient.setQueryData<SortCbtModulesResponse>(
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
