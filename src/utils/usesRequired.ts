export default function usesRequired(items: any[]): boolean {
  // TODO: Add back in conditions for current uses without max when we add an interface for that.

  return [...items].some((item) => {
    if (item.system?.uses?.max) return true;

    return item.actions
      ?.values()
      .some((action) => action.uses?.max);
  });
}
