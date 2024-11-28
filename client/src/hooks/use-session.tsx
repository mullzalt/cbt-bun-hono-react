import { useMemo } from "react";
import {
  QueryKey,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { SessionUser, signOut, userSessionQueryOptions } from "@/queries/auth";

export function useSession() {
  const queryKey: QueryKey = ["auth", "user"];
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(userSessionQueryOptions());

  const isSignedIn = useMemo((): boolean => {
    if (!data) {
      return false;
    }
    return true;
  }, [data]);

  const ensureSession = async () =>
    queryClient.ensureQueryData(userSessionQueryOptions());

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => await signOut({}),
    onMutate: async () => {
      queryClient.cancelQueries({ queryKey });
      const prevSession = queryClient.getQueryData<SessionUser>(queryKey);
      queryClient.invalidateQueries({ queryKey, refetchType: "none" });

      queryClient.setQueryData(queryKey, () => null);

      return { prevSession };
    },
  });

  return {
    user: data?.data,
    states: data?.metadata,
    isSignedIn,
    isSignOutPending: isPending,
    signOut: mutateAsync,
    ensureSession,
  };
}

export type SessionContext = ReturnType<typeof useSession>;
