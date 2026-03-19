export function usesRequired(items: any[]): boolean {
  // TODO: Add back in conditions for current uses without max when we add an interface for that.

  return [...items].some((item) => {
    if (!item) return false;
    if (item?.system?.uses?.max) return true;

    // Check container items
    if (item.type === "object" && item.system.objectType === "container") {
      const containerItems = item.containerItems?.items;
      if (usesRequired(containerItems)) return true;
    }

    return [...(item?.actions?.values() ?? [])].some(
      (action) => action?.uses?.max,
    );
  });
}
