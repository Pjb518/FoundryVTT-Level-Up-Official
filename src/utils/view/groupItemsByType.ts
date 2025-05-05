export function groupItemsByType(
  items: Item[],
  property: string,
): Record<string, Item[]> {
  return items.reduce((categories, item) => {
    const type = foundry.utils.getProperty(item.reactive.system, property);

    categories[type] ??= [] as Item[];
    categories[type].push(item);

    return categories;
  }, {});
}
