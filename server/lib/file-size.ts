const BYTE_SIZE = {
  b: 1,
  Kb: 1024,
  Mb: 1024 * 1024,
  Gb: 1024 * 1024 * 1024,
};

export const fileSize = {
  b: (size: number) => size,
  Kb: (size: number) => Math.round(size * BYTE_SIZE.Kb),
  Mb: (size: number) => Math.round(size * BYTE_SIZE.Mb),
  toKb: (byte: number) => Number(byte / BYTE_SIZE.Kb).toPrecision(2),
  toMb: (byte: number) => Number(byte / BYTE_SIZE.Mb).toPrecision(2),
};
