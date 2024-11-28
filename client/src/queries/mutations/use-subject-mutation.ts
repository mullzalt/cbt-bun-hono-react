import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { createSubject, deleteSubject, editSubject } from "../subject";

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["subjects"];

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      toast.success("Subject successfully created");
    },
    onError: (error) => {
      toast.error("Failed to create subject: " + error.message);
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["subjects"];

  return useMutation({
    mutationFn: editSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      toast.success("Subject successfully updated");
    },
    onError: (error) => {
      toast.error("Failed to update subject: " + error.message);
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["subjects"];

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      toast.success("Subject deleted successfully ");
    },
    onError: (error) => {
      toast.error("Failed to delete subject: " + error.message);
    },
  });
}
