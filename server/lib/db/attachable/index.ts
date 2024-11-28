import { and, eq, inArray } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { DB } from "../../../db";
import { attachmentFiles, attachments } from "../../../db/schemas";
import { deleteFile, writeFile } from "../../uploader";

type AttachableOption = {
  table: string;
  tableId: string;
};

type AttachOptions = {
  dir?: "image" | "document" | "temp";
} & AttachableOption;

async function detach(options: AttachableOption) {
  const { table, tableId } = options;

  return await DB.transaction(async (tx) => {
    const rows = await tx
      .delete(attachments)
      .where(
        and(eq(attachments.tableId, tableId), eq(attachments.table, table)),
      )
      .returning();

    const fileIds = rows.map(({ fileId }) => fileId);
    const files = await tx
      .delete(attachmentFiles)
      .where(inArray(attachmentFiles.id, fileIds))
      .returning();

    files.map(({ path }) => deleteFile(path));
    return files;
  });
}

async function replaceAttachment(files: File[], options: AttachOptions) {
  const { table, tableId, dir = "temp" } = options;
  return await DB.transaction(async (tx) => {
    await detach(options);
    const writenFiles = await Promise.all(
      files.map((file) => writeFile(file, dir)),
    );

    const attachedFiles = await tx
      .insert(attachmentFiles)
      .values(writenFiles)
      .returning();

    const insertAttachments = attachedFiles.map((data) => ({
      tableId,
      table,
      fileId: data.id,
    }));

    return await tx.insert(attachments).values(insertAttachments).returning();
  });
}

export const attachable = (options: AttachOptions) => ({
  attach: async (files: File[]) => await replaceAttachment(files, options),
  detach: async () => await detach(options),
});
