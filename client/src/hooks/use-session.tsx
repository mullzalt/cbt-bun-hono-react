import { useQuery } from "@tanstack/react-query";

import { userSessionQueryOptions } from "@/queries/auth";

export function useSession() {
  const { data: user, ...state } = useQuery(userSessionQueryOptions());

  return { user, ...state };
}
