export default function simpleFilter(reducer, key) {
  const filtersArray = [...reducer.filters];

  if (filtersArray.find((filter) => filter.id === key)) {
    return reducer.filters.removeById(key);
  }

  const filter = (item) => foundry.utils.getProperty(item, key);
  return reducer.filters.add({ id: key, filter, type: 'inclusive' });
}
