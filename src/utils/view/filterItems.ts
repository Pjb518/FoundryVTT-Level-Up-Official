type FilterOptions = {
  searchTerm?: string;
  searchDescription?: boolean;
  filters?: (item: Item) => boolean;
};

function addToFeatures(item: Item) {
  if (CONFIG.A5E.FEATURES_LIST.includes(item.type)) {
    return true;
  } else if (item.type === "archetype") {
    return true;
  }

  return false;
}

function filterByName(item: Item, searchTerm: string) {
  if (item.name.toLocaleLowerCase().includes(searchTerm?.toLocaleLowerCase()))
    return true;
}

function filterByDescription(item: Item, searchTerm: string) {
  if (
    item.system.description
      .toLocaleLowerCase()
      .includes(searchTerm?.toLocaleLowerCase())
  )
    return true;
}

export function filterItems(
  actor: Actor,
  type: string,
  options: FilterOptions = {},
) {
  const { searchTerm, searchDescription, filters } = options;

  return actor.items
    .filter((item) => {
      // Filter by type first
      if (type === "feature" && addToFeatures(item)) return true;
      if (item.type !== type) return false;

      // Filter by search term
      if (searchTerm) {
        const funcArrays = searchDescription
          ? [filterByName, filterByDescription]
          : [filterByName];
        const hasName = funcArrays.some((f) => f(item, searchTerm));

        if (!hasName) return false;
      }

      return true;
    })
    .sort((a, b) => a.sort - b.sort);
}
