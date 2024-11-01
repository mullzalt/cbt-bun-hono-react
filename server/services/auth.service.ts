import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { generateCodeVerifier, generateState } from "arctic";
import type { Session } from "lucia";

import type { SignIn } from "../../shared/schemas/auth.schema";
import { lucia } from "../lib/lucia";
import { google, type GoogleUser } from "../lib/oauth";
import { UserAccountRepository } from "../repositories/user-account.repository";
import { UserRepository } from "../repositories/user.repository";
import { ForbiddenError } from "../util/http-error";

class AuthService {
  private user;
  private accounts;

  constructor() {
    this.user = new UserRepository();
    this.accounts = new UserAccountRepository();
  }

  async signIn(values: SignIn) {
    const { email, password } = values;

    const user = await this.user.findByEmail(email);

    if (!user) {
      throw new ForbiddenError("Incorrect Email or Password");
    }

    if (!user.passwordHash) {
      throw new ForbiddenError("Incorrect Email or Password");
    }

    const validPassword = await Bun.password.verify(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new ForbiddenError("Incorrect Email or Password");
    }

    const newSession = await lucia.createSession(user.id, {
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id).serialize();

    return sessionCookie;
  }

  async signOut(session: Session | null) {
    if (session) {
      await lucia.invalidateSession(session.id);
    }
    return lucia.createBlankSessionCookie().serialize();
  }

  async setGoogleState<TCtx extends Context>(c: TCtx) {
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

  async signInGoogle<TCtx extends Context>(c: TCtx): Promise<boolean> {
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
      return false;
    }

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    );

    const {
      email,
      email_verified,
      picture: image,
      name,
      sub,
    } = (await googleUserResponse.json()) as GoogleUser;

    const emailVerifiedAt = email_verified ? new Date() : null;

    const user = await this.user.create({
      email,
      name,
      emailVerifiedAt,
      image,
    });

    await this.accounts.create({
      userId: user.id,
      providerUserId: sub,
      provider: "google",
    });

    const session = await lucia.createSession(user.id, { email: user.email });
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();

    c.header("Set-Cookie", sessionCookie, { append: true });

    return true;
  }
}

export const authService = new AuthService();
