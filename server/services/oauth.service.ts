import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { generateCodeVerifier, generateState } from "arctic";

import { DB } from "../db";
import { lucia } from "../lib/lucia";
import type { LuciaContext } from "../lib/lucia-context";
import { google, type GoogleUser } from "../lib/oauth";
import { accountRepository } from "../repositories/user-account.repository";
import { profileRepository } from "../repositories/user-profile.repository";
import { userRepository } from "../repositories/user.repository";

export const oauthService = <TContext extends Context<LuciaContext>>(
  c: TContext,
) => {
  const db = DB;
  function getGoogleUrl() {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
      "email",
      "profile",
    ]);

    setCookie(c, "code_verifier", codeVerifier, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    setCookie(c, "google_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    return url.toString();
  }

  function getGoogleStates() {
    const code = c.req.query("code")?.toString() ?? null;
    const state = c.req.query("state")?.toString() ?? null;
    const codeVerifier = getCookie(c)["code_verifier"] ?? null;
    const storedState = getCookie(c)["google_oauth_state"] ?? null;

    if (
      !code ||
      !state ||
      !storedState ||
      !codeVerifier ||
      state !== storedState
    ) {
      return undefined;
    }

    return { code, state, storedState, codeVerifier };
  }

  async function upsertUser(value: GoogleUser) {
    const { email, name, sub, picture } = value;

    const result = await db.transaction(async (tx) => {
      const existingUser = await userRepository().findByEmail(email);

      if (existingUser) {
        await accountRepository()
          .create(
            {
              userId: existingUser.id,
              provider: "google",
              providerUserId: sub,
            },
            tx,
          )
          .onConflictDoNothing();
        return existingUser;
      }

      const [user] = await userRepository()
        .create({ email }, tx)
        .onConflictDoNothing()
        .returning();
      await profileRepository()
        .create({ userId: user.id, name, image: picture }, tx)
        .onConflictDoNothing();
      await accountRepository()
        .create(
          {
            userId: user.id,
            provider: "google",
            providerUserId: sub,
          },
          tx,
        )
        .onConflictDoNothing();

      return user;
    });

    return result;
  }

  async function signInGoogle() {
    const states = getGoogleStates();

    if (!states) return false;

    const { code, codeVerifier } = states;

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    );

    const googleUser = (await googleUserResponse.json()) as GoogleUser;

    const user = await upsertUser(googleUser);

    const session = await lucia.createSession(user.id, { email: user.email });
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();

    c.header("Set-Cookie", sessionCookie, { append: true });

    return true;
  }

  return {
    getGoogleUrl,
    signInGoogle,
  };
};
