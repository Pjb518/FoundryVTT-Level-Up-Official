/**
 * Adds a filter to a given reducer
 * @param {*} reducer
 * @param {*} filterData
 * @returns
 */
export default function addReducerFilter(reducer, filterData) {
  const filterId = filterData?.id ?? null;
  const filtersArray = [...reducer.filters];

  if (!filterId) return reducer.filters.add(filterData);

  if (filtersArray.find((filter) => filter.id === filterId)) return null;
  return reducer.filters.add(filterData);
}
