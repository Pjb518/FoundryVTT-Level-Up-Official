export default function usesRequired(items) {
  return [...items].some((item) => {
    if (item.system?.uses?.value || item.system?.uses?.max) return true;

    return item.actions
      ?.values()
      .some((action) => action.uses?.value || action.uses?.max);
  });
}
