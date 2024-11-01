import { Hono } from "hono";

import { authRoute } from "./auths/auth";
import { oauthGoogleRoute } from "./auths/oauth-google";

export const routes = new Hono()
  .route("/auth", authRoute)
  .route("/auth", oauthGoogleRoute);
