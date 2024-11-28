import { notFound } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

import { ResponseError } from "@/shared/types/response";
import { AsyncReturnType } from "@/shared/types/util";
import { api } from "@/lib/api";

export async function getCbtModules({ cbtId }: { cbtId: string }) {
  const res = await api.cbts[":cbtId"].modules.$get({
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

export async function getCbtModule({
  cbtId,
  cbtModuleId,
}: {
  cbtId: string;
  cbtModuleId: string;
}) {
  const res = await api.cbts[":cbtId"].modules[":cbtModuleId"].$get({
    param: {
      cbtId,
      cbtModuleId,
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

export async function sortCbtModules({
  cbtId,
  ids,
}: {
  cbtId: string;
  ids: string[];
}) {
  const res = await api.cbts[":cbtId"].modules.$put({
    param: {
      cbtId,
    },
    json: { ids },
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

export const cbtModulesQueryOption = ({ cbtId }: { cbtId: string }) =>
  queryOptions({
    queryKey: ["cbts", "cbt", "modules", { cbtId }],
    queryFn: () => getCbtModules({ cbtId }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const cbtModuleQueryOption = ({
  cbtId,
  cbtModuleId,
}: {
  cbtId: string;
  cbtModuleId: string;
}) =>
  queryOptions({
    queryKey: ["cbts", "cbt", "modules", { cbtId, cbtModuleId }],
    queryFn: () => getCbtModule({ cbtId, cbtModuleId }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export type CbtModulesResponse = AsyncReturnType<typeof getCbtModules>;
export type CbtModuleResponse = AsyncReturnType<typeof getCbtModule>;
export type SortCbtModulesResponse = AsyncReturnType<typeof sortCbtModules>;
export type CbtModuleData = CbtModuleResponse["data"];
