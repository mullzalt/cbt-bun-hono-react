import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createInvitation, deleteInvitation } from "../invitation";

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["invitations"];

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      toast.success("Invitation successfully created");
    },
    onError: (error) => {
      toast.error("Failed to create invitation: " + error.message);
    },
  });
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["invitations"];

  return useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      toast.success("Invitation deleted successfully ");
    },
    onError: (error) => {
      toast.error("Failed to delete invitation: " + error.message);
    },
  });
}
