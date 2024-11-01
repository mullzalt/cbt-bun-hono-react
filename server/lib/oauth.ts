import { Google } from "arctic";

import { config } from "./config";

export const google = new Google(
  config.auth.google.clientId,
  config.auth.google.clientSecret,
  config.auth.google.redirectUrl,
);

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
