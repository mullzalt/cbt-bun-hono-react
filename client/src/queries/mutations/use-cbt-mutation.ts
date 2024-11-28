import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { produce } from "immer";
import { toast } from "sonner";

import { UpdateCbt } from "@/shared/schemas/cbt.schema";

import { CbtResponse, updateCbt } from "../cbt";

export function useUpdateCbt(id: string) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["cbts", "cbt", { id }];

  return useMutation({
    mutationFn: async (value: UpdateCbt) =>
      await updateCbt({ param: { cbtId: id }, json: value }),
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData<CbtResponse>(queryKey);

      const updatedData = produce(prevData, (draft) => {
        if (!draft) return undefined;
      });
      queryClient.setQueryData<CbtResponse>(queryKey, updatedData);

      return { prevData };
    },
    onSuccess: (res) => {
      toast.success("Configuration updated successfully");
      queryClient.setQueryData<CbtResponse>(queryKey, res);
    },
    onError: (error, _, context) => {
      toast.error("Failed to update configuration:" + error.message);
      if (context?.prevData) {
        queryClient.setQueryData<CbtResponse>(queryKey, context.prevData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });
    },
  });
}
