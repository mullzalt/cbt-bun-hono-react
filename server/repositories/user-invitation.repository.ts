import {
  and,
  count,
  gt,
  isNotNull,
  isNull,
  lt,
  sql,
  type InferInsertModel,
  type SQL,
} from "drizzle-orm";

import type {
  InvitationStatus,
  InvitationUrlQuery,
} from "../../shared/schemas/invitation.schema";
import { DB, type Database, type Transaction } from "../db";
import { userInvitations } from "../db/schemas";
import { caseQuery } from "../lib/db/case-query";
import { makeCursorQuery } from "../lib/db/cursor";
import { makeDrizzlePgHelper } from "../lib/db/util";

type Insert = InferInsertModel<typeof userInvitations>;
type Update = Partial<Insert>;

export const invitationRepository = () => {
  const db = DB;
  const table = userInvitations;
  const helper = makeDrizzlePgHelper(table);

  const statusWhereQuery: Record<InvitationStatus, SQL<unknown> | undefined> = {
    pending: and(isNull(table.acceptedAt), gt(table.expiresAt, sql`now()`)),
    accepted: isNotNull(table.acceptedAt),
    expired: and(isNull(table.acceptedAt), lt(table.expiresAt, sql`now()`)),
  };

  const statusQuery = caseQuery<InvitationStatus>(
    [
      { when: statusWhereQuery.pending!, then: "pending" },
      { when: statusWhereQuery.accepted!, then: "accepted" },
      { when: statusWhereQuery.expired!, then: "expired" },
    ],
    "expired",
  );

  const parseQuery = (query: InvitationUrlQuery) => {
    const { where: cursorWhere, orderBy } = makeCursorQuery(table, {
      primaryCursor: "sentAt",
      order: "DESC",
      cursor: query.cursor,
    });

    const where = and(cursorWhere, statusWhereQuery[query.status]);

    return { where, orderBy, limit: query.limit };
  };

  const _count = async (query: InvitationUrlQuery) => {
    const { where } = parseQuery(query);

    const [data] = await db
      .select({ count: count() })
      .from(table)
      .where(where)
      .limit(1);

    return data.count;
  };

  const getInvitations = (query: InvitationUrlQuery) => {
    const { where, limit, orderBy } = parseQuery(query);

    return db.query.userInvitations.findMany({
      where,
      orderBy,
      limit,
      with: {
        user: {
          columns: { email: true, id: true },
          with: {
            profile: {
              columns: { name: true, phoneNumber: true, image: true },
            },
          },
        },
      },
      extras: {
        status: statusQuery.as("status"),
      },
    });
  };

  const create = (value: Insert, tx: Transaction | Database = db) =>
    tx.insert(table).values(value);

  const update = (value: Update, tx: Transaction | Database = db) =>
    tx.update(table).set(value);

  const findByToken = (token: string) =>
    db.query.userInvitations.findFirst({
      where: (col, { eq, and, isNull }) =>
        and(eq(col.token, token), isNull(col.acceptedAt), isNull(col.userId)),
    });

  const delete_ = (id: string) => db.delete(table).where(helper.where((col, {eq}) => eq(col.id, id)))

  return {
    create,
    update,
    findByToken,
    getInvitations,
    count: _count,
    helper,
    delete: delete_
  };
};
