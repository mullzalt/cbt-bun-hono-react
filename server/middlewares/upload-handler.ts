import path from "path";
import { validator } from "hono/validator";
import { z } from "zod";

import { type MimeType } from "file-type";

import { fileSize } from "../lib/file-size";
import { TEMP_UPLOAD_FOLDER, type FileResult } from "../lib/uploader/file";
import { UnprocessableEntityError } from "../util/http-error";

type HandleUploadOptions = {
  required?: boolean;
  mimes?: MimeType[];
  maxSize?: number;
  multiple?: boolean;
};

const filesSchema = z
  .instanceof(File)
  .or(z.array(z.instanceof(File)))
  .transform((f) => (Array.isArray(f) ? f : [f]));

type FileSchema = z.infer<typeof filesSchema>;

function validateSizes(files: FileSchema, maxSize: number) {
  files.map(({ size }) => {
    if (size > maxSize)
      throw new UnprocessableEntityError("File size too large", {
        cause: `File too large (${fileSize.toMb(size)} MB), max ${fileSize.toMb(maxSize)} MB`,
      });
  });
}

function validateMimes(files: FileSchema, exts: MimeType[]) {
  files.map(({ type }) => {
    if (!isValidMime(type as MimeType, exts))
      throw new UnprocessableEntityError("Unsupported format", {
        cause: `Expected ${exts.join(", ")}, got ${type}`,
      });
  });
}

function isValidMime(ext: MimeType, exts?: MimeType[]): boolean {
  if (!exts) return true;

  return exts.includes(ext);
}

export const handleUpload = ({
  required = false,
  multiple = false,
  maxSize,
  mimes,
}: HandleUploadOptions = {}) =>
  validator("form", async (value) => {
    const val = value["files"];

    const files = filesSchema.safeParse(val);

    if (required && !files.data) {
      throw new UnprocessableEntityError("File is required");
    }

    if (!files.data) {
      return { files: undefined };
    }

    if (!multiple && files.data.length > 1) {
      files.data = files.data.slice(0, 1);
    }

    if (maxSize) {
      validateSizes(files.data, maxSize);
    }

    if (mimes) {
      validateMimes(files.data, mimes);
    }

    const results: FileResult[] = [];

    for (const file of files.data) {
      const { name, type, size } = file;
      const ext = name.split(".").at(-1)!;
      const filename = [
        new Date().toISOString().replace(/[-:.TZ]/g, ""),
        ext,
      ].join(".");
      const buffer = await file.arrayBuffer();
      const _path = path.join(TEMP_UPLOAD_FOLDER, filename);
      const hasher = new Bun.CryptoHasher("md5");

      const md5 = hasher.update(buffer).digest("hex");
      const url = "/" + _path.split("/").slice(-3).join("/");

      await Bun.write(_path, buffer);

      results.push({
        originalName: name,
        filename,
        ext,
        mimeType: type as MimeType,
        md5,
        size,
        path: _path,
        url,
      });
    }

    return { files: results };
  });
