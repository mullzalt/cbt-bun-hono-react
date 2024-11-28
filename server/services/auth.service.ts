import type { Context } from "hono";
import { eq } from "drizzle-orm";

import type { CreatePassword, SignIn } from "../../shared/schemas/auth.schema";
import { users } from "../db/schemas";
import { lucia } from "../lib/lucia";
import type { LuciaContext } from "../lib/lucia-context";
import { userRepository } from "../repositories/user.repository";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../util/http-error";

export const authService = <TContext extends Context<LuciaContext>>(
  c: TContext,
) => {
  const repo = userRepository();

  const signIn = async (value: SignIn) => {
    const { email, password } = value;
    const user = await repo.findByEmail(email);
    const session = c.get("session");

    if (session) {
      await signOut();
    }

    if (!user) {
      throw new ForbiddenError("wrong_credetial");
    }

    if (!user.passwordHash) {
      throw new ForbiddenError("wrong_credetial");
    }

    const validPassword = await Bun.password.verify(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new ForbiddenError("wrong_credetial");
    }

    const newSession = await lucia.createSession(user.id, {
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id).serialize();
    c.header("Set-Cookie", sessionCookie, { append: true });
  };

  const signOut = async () => {
    const session = c.get("session");
    if (session) {
      await lucia.invalidateSession(session.id);
    }

    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  };

  const getUserInfo = async () => {
    const sessionUser = c.get("user");
    if (!sessionUser) {
      throw new UnauthorizedError("unauthorized");
    }
    const { id, role } = sessionUser;

    const user = await repo.getUserWithProfiles(id);
    if (!user) {
      throw new NotFoundError("not_found");
    }

    const {
      passwordHash,
      profile: _profile,
      studentProfile: _studentProfile,
      ...rest
    } = user;

    const profile = _profile as typeof _profile | null;

    const studentProfile =
      role === "student"
        ? (_studentProfile as typeof _studentProfile | null)
        : undefined;

    return {
      data: {
        ...rest,
        profile,
        studentProfile,
      },
      metadata: {
        shouldFillPassword: Boolean(!passwordHash),
        shouldFillProfile: Boolean(!profile),
        shouldFillStudentProfile:
          role === "student" ? Boolean(!studentProfile) : false,
      },
    };
  };

  const createPassword = async (value: CreatePassword) => {
    const user = c.get("user")!;

    const { password } = value;

    const passwordHash = await Bun.password.hash(password);

    await repo.update({ passwordHash }).where(eq(users.id, user.id));
  };

  return {
    signIn,
    signOut,
    getUserInfo,
    createPassword,
  };
};
