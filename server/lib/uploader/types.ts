import type { MimeType } from "file-type";

export type UploadFileResult = {
  name: string;
  size: number;
  checksum: string;
  mimeType: MimeType;
  path: string;
  url: string;
};
