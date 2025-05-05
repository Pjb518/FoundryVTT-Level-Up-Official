type FilterOptions = {
  searchTerm?: string;
  searchDescription?: boolean;
  filters?: (item: Item) => boolean;
};

export function filterItems(
  actor: Actor,
  type: string,
  options: FilterOptions = {},
) {
  const { searchTerm, searchDescription, filters } = options;

  return actor.items.filter((item) => {
    if (item.type !== type) return false;

    if (searchTerm?.length) {
      if (
        !item.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });
}
