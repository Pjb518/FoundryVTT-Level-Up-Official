export default function toggleFilter(filters, filterValue) {
  const inclusiveFilters = filters.inclusive ?? [];
  const exclusiveFilters = filters.exclusive ?? [];

  if (!inclusiveFilters.includes(filterValue) && !exclusiveFilters.includes(filterValue)) {
    inclusiveFilters.push(filterValue);
  } else if (inclusiveFilters.includes(filterValue)) {
    inclusiveFilters.splice(inclusiveFilters.indexOf(filterValue), 1);
    exclusiveFilters.push(filterValue);
  } else {
    exclusiveFilters.splice(exclusiveFilters.indexOf(filterValue), 1);
  }

  return [inclusiveFilters, exclusiveFilters];
}
