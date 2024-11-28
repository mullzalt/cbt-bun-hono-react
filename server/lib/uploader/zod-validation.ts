import { z } from "zod";

import type { MimeType } from "file-type";

import { formatBytes } from "./util";

type CreateUploadSchemaOptions = {
  mimeTypes?: MimeType[];
  maxSize?: number;
};

function validateMimeType(file: File, mimeTypes: MimeType[]): boolean {
  return mimeTypes.includes(file.type as MimeType);
}

function validateSize(file: File, maxSize: number): boolean {
  return file.size < maxSize;
}

export function createUploadSchema({
  maxSize,
  mimeTypes = [],
}: CreateUploadSchemaOptions = {}) {
  const fileSchema = z
    .instanceof(File)
    .refine(
      (file) => (
        maxSize ? validateSize(file, maxSize) : true,
        `File size exceed ${formatBytes(maxSize!)}`
      ),
    )
    .refine(
      (file) => (mimeTypes.length ? validateMimeType(file, mimeTypes) : true),
      `Invalid file type`,
    );

  const stringNullSchema = z
    .string()
    .transform((s) => (s === "" ? null : undefined));

  return z.optional(fileSchema.or(stringNullSchema));
}
