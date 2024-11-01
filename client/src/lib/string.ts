export function nameInitials(name: string) {
  return name
    .toUpperCase()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
