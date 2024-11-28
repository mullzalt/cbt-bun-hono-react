import { z } from "zod";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fallback } from "@tanstack/router-zod-adapter";

import { cbtSubjectUrlQuerySchema } from "@/shared/query/cbt-subject.query.schema";
import { ResponseError } from "@/shared/types/response";
import { ArrayElement, AsyncReturnType } from "@/shared/types/util";
import { api, createFetcher } from "@/lib/api";

export const subjectSearchSchema = z.object({
  q: fallback(cbtSubjectUrlQuerySchema.shape.q, ""),
});

export type SubjectSearch = z.infer<typeof subjectSearchSchema>;

export async function getSubjects({
  query,
  pageParam: cursor,
}: {
  query: SubjectSearch;
  pageParam?: string;
}) {
  const res = await api.subjects.$get({
    query: { ...query, orderBy: "name", order: "ASC", cursor },
  });

  if (!res.ok) {
    const { error } = (await res.json()) as unknown as ResponseError;
    throw new Error(error.message);
  }

  return await res.json();
}

export const createSubject = createFetcher(api.subjects.$post);

export const editSubject = createFetcher(api.subjects[":subjectId"].$put);
export const deleteSubject = createFetcher(api.subjects[":subjectId"].$delete);

export const subjectsInfiniteQueryOptions = (options: SubjectSearch) => {
  return infiniteQueryOptions({
    queryKey: ["subjects", { ...options }],
    queryFn: ({ pageParam }) => getSubjects({ pageParam, query: options }),
    initialPageParam: "",
    staleTime: 60 * 60 * 1000,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor,
  });
};

export type SubjectResponse = AsyncReturnType<typeof getSubjects>;
export type SubjectData = ArrayElement<SubjectResponse["data"]>;
