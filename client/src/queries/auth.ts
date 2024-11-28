import { InferRequestType, InferResponseType } from "hono";
import { QueryClient, queryOptions } from "@tanstack/react-query";

import { SignIn } from "@/shared/schemas/auth.schema";
import { ResponseError } from "@/shared/types/response";
import { api, createFetcher } from "@/lib/api";

export async function signIn(values: SignIn) {
  const res = await api.auth["sign-in"].$post({
    form: values,
  });

  if (!res.ok) {
    const { error } = (await res.json()) as unknown as ResponseError;
    throw new Error(error.message);
  }

  return await res.json();
}

export async function getAuthUser() {
  const res = await api.auth.info.$get();
  if (!res.ok) {
    return null;
  }
  const { data, metadata } = await res.json();
  return { data, metadata };
}

export const signOut = createFetcher(api.auth["sign-out"].$get);

export const createPassword = createFetcher(api.auth.password.$post);

export const createStudentProfile = createFetcher(
  api.auth["student-profile"].$post,
);

export const upsertProfile = createFetcher(
  api.auth.profile.$post
)

export const userSessionQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "user"],
    queryFn: getAuthUser,
    staleTime: 2 * 7 * 24 * 60 * 1000, // 2 week
  });

export async function validateSession(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData(userSessionQueryOptions());
  return user;
}

export type SessionUser = InferResponseType<
  (typeof api.auth.info)["$get"]
>["data"];
