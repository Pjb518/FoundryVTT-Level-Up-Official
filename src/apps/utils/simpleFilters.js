export function simpleFilter(reducer, key) {
  const filtersArray = [...reducer.filters];

  if (filtersArray.find((filter) => filter.id === key)) {
    return reducer.filters.removeById(key);
  }

  const filter = (item) => foundry.utils.getProperty(item, key);
  return reducer.filters.add({ id: key, filter });
}

export function booleanFilter(reducer, key, value) {
  const filtersArray = [...reducer.filters];

  if (filtersArray.find((filter) => filter.id === key)) {
    return reducer.filters.removeById(key);
  }

  const filter = (item) => foundry.utils.getProperty(item, key).includes(value);
  return reducer.filters.add({ id: key, filter });
}
