import { InferResponseType } from "hono";
import { z } from "zod";
import { notFound } from "@tanstack/react-router";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fallback } from "@tanstack/router-zod-adapter";

import { cbtUrlQuerySchema } from "@/shared/query/cbt.query.schema";
import { ResponseError } from "@/shared/types/response";
import { api, createFetcher } from "@/lib/api";

export const cbtSearchSchema = z.object({
  q: fallback(cbtUrlQuerySchema.shape.q, ""),
  order: fallback(cbtUrlQuerySchema.shape.order, "DESC"),
  orderBy: fallback(cbtUrlQuerySchema.shape.orderBy, "createdAt"),
  status: fallback(cbtUrlQuerySchema.shape.status, undefined),
});

export type CbtsSearch = z.infer<typeof cbtSearchSchema>;

export async function getCbts({
  query,
  pageParam: cursor,
}: {
  query: CbtsSearch;
  pageParam?: string;
}) {
  const res = await api.cbts.$get({ query: { ...query, cursor } });

  if (!res.ok) {
    const { error } = (await res.json()) as unknown as ResponseError;
    throw new Error(error.message);
  }

  return await res.json();
}

export async function getCbt(cbtId: string) {
  const res = await api.cbts[":cbtId"].$get({
    param: {
      cbtId,
    },
  });
  if (!res.ok) {
    if (res.status === 404 || res.status === 400) {
      throw notFound();
    }
    const { error } = (await res.json()) as unknown as ResponseError;
    throw new Error(error.message);
  }
  return await res.json();
}

export const createCbt = createFetcher(api.cbts.$post);
export const updateCbt = createFetcher(api.cbts[":cbtId"].$put);

export const cbtQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["cbts", "cbt", { id }],
    queryFn: () => getCbt(id),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const cbtInfiniteQueryOptions = (options: CbtsSearch) => {
  return infiniteQueryOptions({
    queryKey: ["cbts", { ...options }],
    queryFn: ({ pageParam }) => getCbts({ pageParam, query: options }),
    initialPageParam: "",
    staleTime: 60 * 60 * 1000,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
  });
};

export type CbtResponse = InferResponseType<
  (typeof api.cbts)[":cbtId"]["$get"]
>;
export type CbtsResponse = InferResponseType<(typeof api.cbts)["$get"]>;
export type CbtData = CbtResponse["data"];
