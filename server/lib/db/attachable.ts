import { and, eq, getTableColumns, getTableName } from "drizzle-orm";

import { DB, type Database, type Transaction } from "../../db";
import { attachmentFiles, attachments } from "../../db/schemas";
import { deleteFile, writeFile } from "../uploader";
import type { PgTableWithId } from "./type";

export const hasOneAttachment = <TTable extends PgTableWithId>(
  table: TTable,
) => {
  const attachmentTable = attachments;
  const fileTable = attachmentFiles;
  const db = DB;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...fileColumns } = getTableColumns(fileTable);
  const { tableId } = getTableColumns(attachmentTable);

  const tableName = getTableName(table);

  const detach = async (
    tableId: string,
    invoker: Transaction | Database = db,
  ) => {
    return await invoker.transaction(async (tx) => {
      const [attachmentData] = await tx
        .delete(attachmentTable)
        .where(
          and(
            eq(attachmentTable.table, tableName),
            eq(attachmentTable.tableId, tableId),
          ),
        )
        .returning();

      if (!attachmentData) return;

      const [fileData] = await tx
        .delete(fileTable)
        .where(eq(fileTable.id, attachmentData.fileId))
        .returning();

      if (!fileData) return;

      await deleteFile(fileData.path);
    });
  };

  const attach = async (
    tableId: string,
    file: File,
    invoker: Transaction | Database = db,
  ) => {
    return await invoker.transaction(async (tx) => {
      await detach(tableId, tx);
      const uploadValue = await writeFile(file, "storage");
      const [fileData] = await db
        .insert(fileTable)
        .values(uploadValue)
        .returning();

      return await tx
        .insert(attachmentTable)
        .values({
          table: tableName,
          tableId,
          fileId: fileData.id,
        })
        .returning();
    });
  };

  const withAttachment = () =>
    db
      .select({ ...fileColumns, tableId })
      .from(attachmentTable)
      .leftJoin(table, eq(attachmentTable.tableId, table.id))
      .leftJoin(fileTable, eq(fileTable.id, attachmentTable.fileId));
  return {
    withAttachment,
    attach,
    detach,
  };
};
