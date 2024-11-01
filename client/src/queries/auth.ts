import { InferResponseType } from "hono";
import { QueryClient, queryOptions } from "@tanstack/react-query";

import { SignIn } from "@/shared/schemas/auth.schema";
import { ResponseError } from "@/shared/types/response";
import { api } from "@/lib/api";

export async function signIn(values: SignIn) {
  const res = await api.auth["sign-in"].$post({
    json: values,
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
  const { data } = await res.json();
  return data;
}


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

export type SessionUser = InferResponseType<(typeof api.auth.info)["$get"]>["data"];
