function getItemType(item: Item) {
  let itemType = foundry.utils.getProperty(item, "type");

  if (CONFIG.A5E.FEATURES_LIST.includes(itemType)) {
    return itemType;
  } else if (itemType === "archetype") {
    return "class";
  }

  return;
};

export function groupItemsByType(
  items: Item[],
  property: string,
): Record<string, Item[]> {
  return items.reduce((categories, item) => {
    //@ts-ignore
    const type = foundry.utils.getProperty(item.reactive.system, property) ?? getItemType(item.reactive) ?? "uncategorized";

    categories[type] ??= [] as Item[];
    categories[type].push(item);

    return categories;
  }, {});
}
