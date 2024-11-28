export function datetimeToString(date: Date | null | undefined) {
  if (!date) {
    return null;
  }
  return date.toISOString();
}

export function stringToDatetime(str: string | null | undefined) {
  if (!str) {
    return null;
  }

  return new Date(str);
}

export function parseNullable<T = any>(
  value: T | null | undefined,
): T | undefined {
  if (!value) return undefined;

  return value;
}
