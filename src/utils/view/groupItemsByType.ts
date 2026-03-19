function getItemType(item: Item, property: string) {
  let itemType = foundry.utils.getProperty(item, "type");
  let subType = foundry.utils.getProperty(item.system, property);

  if (CONFIG.A5E.FEATURES_LIST.includes(itemType)) {
    return itemType;
  } else if (itemType === "archetype") {
    return "class";
  }

  if (itemType === "object") {
    if (["armor", "shield", "helm"].includes(subType)) subType = "armor";
  }

  return subType ?? "uncategorized";
}

export function groupItemsByType(
  items: Item[],
  property: string,
): Record<string, Item[]> {
  const reducerSortMap = CONFIG.A5E.reducerSortMap?.[items[0]?.type];
  let acc = {};
  if (reducerSortMap) {
    Object.keys(reducerSortMap).forEach((k) => (acc[k] ??= []));
  }

  return items.reduce((categories, item) => {
    //@ts-ignore
    const type = getItemType(item, property);

    categories[type] ??= [] as Item[];
    categories[type].push(item);

    return categories;
  }, acc);
}
