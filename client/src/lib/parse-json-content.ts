import { Content } from "@tiptap/react";

export function parseTipTapContent(content: Content) {
  try {
    if (typeof content === "string") {
      content = JSON.parse(content);
    }
    return content;
  } catch {
    return content;
  }
}
