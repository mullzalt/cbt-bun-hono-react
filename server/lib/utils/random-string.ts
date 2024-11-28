export function randomString(size: number = 6) {
  return Math.random()
    .toString(36)
    .slice(-1 * size);
}
