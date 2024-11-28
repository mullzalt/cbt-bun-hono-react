import { randomBytes } from "node:crypto";
import type { Context } from "hono";

import { createDate, TimeSpan } from "oslo";

import type { InvitationUrlQuery } from "../../shared/schemas/invitation.schema";
import type { UserRole } from "../../shared/schemas/user.schema";
import { DB } from "../db";
import { config } from "../lib/config";
import { getPaginationOption } from "../lib/db/cursor";
import { lucia } from "../lib/lucia";
import type { LuciaContext } from "../lib/lucia-context";
import { invitationRepository } from "../repositories/user-invitation.repository";
import { userRepository } from "../repositories/user.repository";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../util/http-error";

export const invitationService = <TContext extends Context<LuciaContext>>(
  c: TContext,
) => {
  const repo = invitationRepository();
  const helper = repo.helper;
  const userRepo = userRepository();
  const db = DB;

  const generateRandomToken = () => randomBytes(16).toString("hex");

  const isExpire = (date: Date) => date < new Date();

  const create = async (role?: UserRole) => {
    const user = c.get("user")!;

    const inviteeId = user.id;
    const expiresAt = createDate(new TimeSpan(3, "d"));
    const [data] = await repo
      .create({
        inviteeId,
        expiresAt,
        token: generateRandomToken(),
        role,
      })
      .returning();
    return { data };
  };

  const getsPagination = async (query: InvitationUrlQuery) => {
    const data = await repo.getInvitations(query);
    const count = await repo.count(query);
    const pagination = getPaginationOption({
      count,
      limit: query.limit,
      data,
      primaryKey: "id",
    });

    const parsed = data.map((d) => ({
      ...d,
      url: config.invitation.url(d.token),
    }));

    return { data: parsed, pagination };
  };

  const get = async (token: string) => {
    const data = await repo.findByToken(token);

    if (!data) {
      throw new NotFoundError();
    }

    if (isExpire(data.expiresAt)) {
      throw new ForbiddenError("token_expires");
    }

    return {
      data: { ...data, url: config.invitation.url(data.token) },
    };
  };

  const accept = async ({ token, email }: { token: string; email: string }) => {
    const invitation = await repo.findByToken(token);

    if (!invitation) {
      throw new NotFoundError();
    }

    if (isExpire(invitation.expiresAt)) {
      throw new ForbiddenError("token_expires");
    }

    const emailTaken = await userRepo.isEmailTaken(email);

    if (emailTaken) {
      throw new ConflictError("email_taken");
    }

    const invitedUser = await db.transaction(async (tx) => {
      const [newUser] = await userRepo
        .create({ email, role: invitation.role }, tx)
        .returning();
      await repo
        .update({ acceptedAt: new Date(), userId: newUser.id }, tx)
        .where(helper.where((col, { eq }) => eq(col.token, token)));

      return newUser;
    });

    const newSession = await lucia.createSession(invitedUser.id, {
      email: invitedUser.email,
    });
    const sessionCookie = lucia.createSessionCookie(newSession.id).serialize();
    c.header("Set-Cookie", sessionCookie, { append: true });
  };

  const delete_ = async (id: string) => {
    await repo.delete(id)
  }

  return {
    create,
    get,
    accept,
    getsPagination,
    delete: delete_
  };
};
