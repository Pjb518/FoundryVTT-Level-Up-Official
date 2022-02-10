export default function dynamicFilter(actor, items, key, flag) {
  const filters = actor.getFlag('a5e', flag);
  let filteredItems = Array.from(items);

  if (filters?.inclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => filters.inclusive.includes(getProperty(item, key))
    );
  }

  if (filters?.exclusive?.length) {
    filteredItems = filteredItems.filter(
      (item) => !filters.exclusive.includes(getProperty(item, key))
    );
  }

  return filteredItems;
}
