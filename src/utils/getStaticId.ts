export function getStaticId(id: string) {
  if (id.length >= 16) return id.substring(0, 16);
  return id.padEnd(16, "0");
}
