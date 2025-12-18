function getItemType(item: Item) {
  let itemType = foundry.utils.getProperty(item, "type");

  if (itemType === "background") {
    return "background";
  }

  if (itemType === "class" || itemType === "archetype") {
    return "class";
  }

  if (itemType === "culture") {
    return "culture";
  }

  if (itemType === "destiny") {
    return "destiny";
  }

  if (itemType === "heritage") {
    return "heritage";
  }

  return false;
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
