import { unlink } from "node:fs";
import path from "path";

import type { MimeType } from "file-type";

import type { UploadFileResult } from "./types";

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

const TEMP_UPLOAD_FOLDER = path.join(__dirname, "../../../static/temp");
const IMAGE_UPLOAD_FOLDER = path.join(__dirname, "../../../static/images");
const DOCUMENT_UPLOAD_FOLDER = path.join(
  __dirname,
  "../../../static/documents",
);
const STORAGE_UPLOAD_FOLDER = path.join(__dirname, "../../../static/storage");

const UPLOAD_PATH = {
  image: IMAGE_UPLOAD_FOLDER,
  document: DOCUMENT_UPLOAD_FOLDER,
  temp: TEMP_UPLOAD_FOLDER,
  storage: STORAGE_UPLOAD_FOLDER,
};

export async function deleteFile(path: string) {
  let success: boolean = true;
  let _error: { message: string | undefined } | undefined;
  unlink(path, (error) => {
    success = false;
    _error = { message: error?.message };
  });
  return { success, error: _error };
}

export async function writeFile(
  file: File,
  dir: keyof typeof UPLOAD_PATH = "temp",
): Promise<UploadFileResult> {
  const { name, type, size } = file;
  const ext = name.split(".").at(-1)!;
  const filename = [new Date().toISOString().replace(/[-:.TZ]/g, ""), ext].join(
    ".",
  );
  const _path = path.join(UPLOAD_PATH[dir], filename);
  const hasher = new Bun.CryptoHasher("md5");

  const checksum = hasher.update(file).digest("hex");

  await Bun.write(_path, file);

  const url = "/" + _path.split("/").slice(-3).join("/");

  return {
    mimeType: type as MimeType,
    path: _path,
    name,
    checksum,
    size,
    url,
  };
}
