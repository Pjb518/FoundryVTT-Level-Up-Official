export function prepareSpellBooks(actor: Actor, items: Item[]) {
  const spellBooks: Record<string, Item[]> = [
    ...actor.spellBooks.keys(),
  ].reduce(
    (acc, key) => {
      acc[key] ??= [];
      return acc;
    },
    {} as Record<string, Item[]>,
  );

  spellBooks.none = [] as Item[];

  items.forEach((item) => {
    const id = item.system.spellBook || "none";
    if (spellBooks[id]) spellBooks[id].push(item);
    else spellBooks.none.push(item);
  });

  return spellBooks;
}
