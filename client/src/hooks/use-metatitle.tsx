import { useMatches } from "@tanstack/react-router";

export function useMetaTitle({ fallback = "" }: { fallback?: string }) {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta.title);
  const title = meta?.title ?? fallback;

  return { title };
}
