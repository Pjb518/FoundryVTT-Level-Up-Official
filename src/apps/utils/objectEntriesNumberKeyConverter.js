export default function objectEntriesNumberKeyConverter(obj) {
  return Object.entries(obj).map(([key, value]) => [Number(key), value]);
}
