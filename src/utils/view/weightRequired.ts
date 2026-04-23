export function weightRequired(items: any[]): boolean {
  return [...items].some((item) => {
    if (item?.system?.weight) return true;
  });
}
