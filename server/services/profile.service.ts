import type { Context } from "hono";
import { eq } from "drizzle-orm";

import type {
  CreateStudentProfile,
  UpsertProfile,
} from "../../shared/schemas/profile.schema";
import { DB } from "../db";
import { userProfiles, userStudentProfiles } from "../db/schemas";
import type { LuciaContext } from "../lib/lucia-context";
import { profileRepository } from "../repositories/user-profile.repository";
import { studentProfileRepository } from "../repositories/user-student-profile.repository";
import { UnauthorizedError } from "../util/http-error";

export const profileService = <TContext extends Context<LuciaContext>>(
  c: TContext,
) => {
  const db = DB;
  const profileRepo = profileRepository();
  const studentProfileRepo = studentProfileRepository();
  const user = c.get("user");

  if (!user) {
    throw new UnauthorizedError("unauthorized");
  }

  const upsertProfile = async (value: UpsertProfile) => {
    const userId = user.id;

    const [data] = await profileRepo
      .create({ ...value, userId })
      .onConflictDoUpdate({
        target: [userProfiles.userId],
        set: { ...value },
      })
      .returning();

    return { data };
  };

  const createStudentProfile = async (value: CreateStudentProfile) => {
    const userId = user.id;

    const { phoneNumber, name, ...studentValue } = value;

    const data = await db.transaction(async (tx) => {
      const [profile] = await profileRepo
        .create({ phoneNumber, name, userId }, tx)
        .onConflictDoUpdate({
          target: [userProfiles.userId],
          set: { phoneNumber, name },
        })
        .returning();
      const [studentProfile] = await studentProfileRepo
        .create({ userId, ...studentValue }, tx)
        .onConflictDoUpdate({
          target: [userStudentProfiles.userId],
          set: { ...studentValue },
        })
        .returning();

      return { profile, studentProfile };
    });

    return { data };
  };

  return {
    createStudentProfile,
    upsertProfile,
  };
};
