// eslint-disable-next-line import/no-unresolved
import { createFilterQuery } from '@typhonjs-fvtt/svelte-standard/store';

/**
 * Adds a filter to a given reducer
 * @param {*} reducer
 * @returns {} searchInput
 */
export function addSearchFilter(reducer) {
  const searchFilter = createFilterQuery('name');
  const searchInput = {
    store: searchFilter,
    placeholder: 'Search',
    type: 'search'
  };
  reducer.filters.add({ id: 'searchFilter', filter: searchFilter });

  return searchInput;
}

export function removeSearchFilter(reducer) {
  reducer.filters.removeById('searchFilter');
}
