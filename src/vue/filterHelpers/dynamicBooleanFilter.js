export default function dynamicBooleanFilter(actor, items, key, flag) {
  const filters = actor.getFlag('a5e', flag);
  let filteredItems = Array.from(items);

  if (filters?.inclusive?.length) {
    filteredItems = filteredItems.filter((item) => (
      filters.inclusive.some((value) => getProperty(item, key)[value])));
  }

  if (filters?.exclusive?.length) {
    filteredItems = filteredItems.filter((item) => (
      !filters.exclusive.some((value) => getProperty(item, key)[value])));
  }

  return filteredItems;
}
