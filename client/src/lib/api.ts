import {
  ClientRequestOptions,
  ClientResponse,
  hc,
  InferRequestType,
  InferResponseType,
} from "hono/client";

import { Api } from "@/shared/types/api";
import { ResponseError } from "@/shared/types/response";

const honoClient = hc<Api>("");

export type Client = typeof honoClient;

const hcWithType = (...args: Parameters<typeof hc>): Client => hc<Api>(...args);

const client = hcWithType("/");

export function createFetcher<
  TFn extends Function,
  TArgs extends InferRequestType<TFn>,
  TRes extends InferResponseType<TFn>,
>(fn: TFn) {
  return async (args: TArgs, options?: ClientRequestOptions): Promise<TRes> => {
    const res = await fn(args, options);
    if (!res.ok) {
      const { error } = (await res.json()) as unknown as ResponseError;
      throw new Error(error.message);
    }

    return await res.json();
  };
}

export function createGetFetcher<
  TFn extends Function,
  TArgs extends InferRequestType<TFn>,
  TRes extends InferResponseType<TFn>,
>(fn: TFn) {
  return async (
    args: TArgs,
    options?: ClientRequestOptions,
  ): Promise<TRes | (ResponseError & { status: number })> => {
    const res = await fn(args, options);
    if (!res.ok) {
      const error = (await res.json()) as unknown as ResponseError;
      return { ...error, status: res.status };
    }

    return await res.json();
  };
}

export const api = client.api;
