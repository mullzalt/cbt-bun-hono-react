import { hc } from "hono/client";

import { Api } from "@/shared/types/api";

const client = hc<Api>("/");

export const api = client.api;
