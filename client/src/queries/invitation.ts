import { z } from "zod";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fallback } from "@tanstack/router-zod-adapter";

import { invitationUrlQuerySchema } from "@/shared/schemas/invitation.schema";
import { ArrayElement, AsyncReturnType } from "@/shared/types/util";
import { api, createFetcher, createGetFetcher } from "@/lib/api";

export const createInvitation = createFetcher(api.invitations.$post);

export const getInvitations = createFetcher(api.invitations.$get);

export const deleteInvitation = createFetcher(
  api.invitations[":invitationId"].$delete,
);

export const getInvitation = createGetFetcher(api.invitations[":token"].$get);
export const acceptInvitation = createFetcher(api.invitations[":token"].$post);

export const invitationSearchSchema = z.object({
  status: fallback(invitationUrlQuerySchema.shape.status, "pending").default(
    "pending",
  ),
});

export type InvitationSearch = z.infer<typeof invitationSearchSchema>;

export const getInvitationQueryOptions = (token: string) => {
  return queryOptions({
    queryKey: ["invitation", { token }],
    queryFn: () => getInvitation({ param: { token } }),
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
};

export const invitationsInfiniteQueryOption = (options: InvitationSearch) => {
  return infiniteQueryOptions({
    queryKey: ["invitations", { ...options }],
    queryFn: ({ pageParam }) =>
      getInvitations({ query: { ...options, cursor: pageParam } }),
    initialPageParam: "",
    staleTime: 60 * 60 * 1000,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
  });
};

export type InvitationsResponse = AsyncReturnType<typeof getInvitations>;
export type InvitationData = ArrayElement<InvitationsResponse["data"]>;
