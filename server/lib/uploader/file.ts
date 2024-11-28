import { unlinkSync } from "fs";
import path from "path";

import type { MimeType } from "file-type";

export const TEMP_UPLOAD_FOLDER = path.join(__dirname, "../../../static/temp");
export const IMAGE_UPLOAD_FOLDER = path.join(
  __dirname,
  "../../../static/images",
);
export const DOCUMENT_UPLOAD_FOLDER = path.join(
  __dirname,
  "../../../static/documents",
);

export type FileResult = {
  originalName: string;
  filename: string;
  ext: string;
  mimeType: MimeType;
  size: number;
  path: string;
  md5: string;
  url: string;
};

export const UPLOAD_PATH = {
  image: IMAGE_UPLOAD_FOLDER,
  document: DOCUMENT_UPLOAD_FOLDER,
  temp: TEMP_UPLOAD_FOLDER,
};

export type SaveFileOptions = {
  destination: keyof typeof UPLOAD_PATH;
};

export function deleteFile(target: string) {
  unlinkSync(target);
}

export async function saveFile(
  file: FileResult,
  { destination }: SaveFileOptions,
): Promise<FileResult> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path: _path, url: _, filename, ...rest } = file;
  const newPath = path.join(UPLOAD_PATH[destination], filename);
  const newUrl = "/" + newPath.split("/").slice(-3).join("/");
  try {
    const tempFile = Bun.file(_path);
    await Bun.write(newPath, tempFile);
  } catch {
    throw new Error("Failed to save file");
  } finally {
    unlinkSync(_path);
  }
  return {
    url: newUrl,
    path: newPath,
    filename,
    ...rest,
  };
}
