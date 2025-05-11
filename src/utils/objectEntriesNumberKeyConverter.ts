export function objectEntriesNumberKeyConverter(obj: Record<string, any>) {
  return Object.entries(obj).map(([key, value]) => [Number(key), value]);
}
