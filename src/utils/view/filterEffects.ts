type FilterOptions = {
  searchTerm?: string;
  searchDescription?: boolean;
  filters?: Record<string, (effect: ActiveEffect) => boolean>;
};

function filterByName(effect: ActiveEffect, searchTerm: string) {
  if (effect.name.toLocaleLowerCase().includes(searchTerm?.toLocaleLowerCase()))
    return true;
}

function filterByDescription(effect: ActiveEffect, searchTerm: string) {
  if (
    effect.system.description
      .toLocaleLowerCase()
      .includes(searchTerm?.toLocaleLowerCase())
  )
    return true;
}

export function filterEffects(
  document: Actor | Item,
  type: string,
  options: FilterOptions = {},
) {
  const { searchTerm, searchDescription, filters } = options;

  return document.effects
    .filter((effect) => {
      // Filter by type first
      if (type.length && effect.system.effectType !== type) return false;

      // Filter by search term
      if (searchTerm) {
        const funcArrays = searchDescription
          ? [filterByName, filterByDescription]
          : [filterByName];
        const hasName = funcArrays.some((f) => f(effect, searchTerm));

        if (!hasName) return false;
      }

      return true;
    })
    .sort((a, b) => a.sort - b.sort);
}
