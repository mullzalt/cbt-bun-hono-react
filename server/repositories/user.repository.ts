import { eq, getTableColumns } from "drizzle-orm";

import type { UserUrlQuery } from "../../shared/query/user.query.schema";
import type { InsertUser, UpdateUser } from "../../shared/schemas/user.schema";
import { DB, type Database, type Transaction } from "../db";
import { userProfiles, users } from "../db/schemas";
import { makeCursorQuery } from "../lib/db/cursor";
import { toSqlLike } from "../lib/db/search-query";
import { makeDrizzlePgHelper } from "../lib/db/util";

export const userRepository = () => {
  {
    const db = DB;
    const table = users;
    const helper = makeDrizzlePgHelper(table);

    const create = (value: InsertUser, tx: Transaction | Database = db) =>
      tx.insert(table).values(value);

    const update = (value: UpdateUser, tx: Transaction | Database = db) =>
      tx.update(table).set(value);

    const findByEmail = (email: string) =>
      db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

    const findById = (id: string) =>
      db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
        with: {
          profile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
          studentProfile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
        },
      });

    const parseUrlQuery = (query: UserUrlQuery) => {
      const { where: cursorWhere, orderBy } = makeCursorQuery(table, {
        primaryCursor: "createdAt",
        orderBy: query.orderBy,
        order: query.order,
        cursor: query.cursor,
      });

      const searchQuery = toSqlLike(query.q);

      const where = helper.where((col, { eq, and, or, ilike, inArray }) =>
        and(
          eq(col.role, query.role),
          cursorWhere,
          searchQuery
            ? or(
                ilike(col.email, searchQuery),
                inArray(
                  col.id,
                  db
                    .select({ id: userProfiles.userId })
                    .from(userProfiles)
                    .where(
                      or(
                        ilike(userProfiles.name, searchQuery),
                        ilike(userProfiles.phoneNumber, searchQuery),
                      ),
                    ),
                ),
              )
            : undefined,
        ),
      );

      return { where, orderBy, limit: query.limit };
    };

    const getUsers = (query: UserUrlQuery) => {
      const { where, orderBy, limit } = parseUrlQuery(query);

      return db.query.users.findMany({
        columns: {
          passwordHash: false,
        },
        where,
        with: {
          profile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
          studentProfile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
        },
        limit,
        orderBy,
      });
    };

    const countUsers = async (query: UserUrlQuery) => {
      const { where } = parseUrlQuery(query);
      const [data] = await helper.count(db).where(where).limit(1);
      return data.count;
    };

    const getUserWithProfiles = (id: string) =>
      db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, id),
        with: {
          profile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
          studentProfile: {
            columns: { userId: false, createdAt: false, updatedAt: false },
          },
        },
      });

    const isEmailTaken = async (email: string) => {
      const user = await findByEmail(email);
      return Boolean(user);
    };

    return {
      create,
      update,
      getUsers,
      getUserWithProfiles,
      findByEmail,
      isEmailTaken,
      helper,
      count: countUsers,
      findById,
    };
  }
};
