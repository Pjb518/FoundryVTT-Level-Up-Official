/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

import { DynReducerHelper } from '#runtime/svelte/store/reducer';
import regexObjectQuery from './searchUtils';

/**
 * Adds a filter to a given reducer
 * @param {*} reducer
 * @returns {} searchInput
 */
export function addSearchFilter(reducer) {
  const searchFilter = DynReducerHelper.filters.regexObjectQuery(['name', 'containerItemNames']);
  const searchInput = {
    store: searchFilter,
    placeholder: 'Search',
    type: 'search'
  };
  reducer.filters.add({ id: 'searchFilter', filter: searchFilter });

  return searchInput;
}

export function addTJSDocumentSearchFilter(reducer) {
  const searchFilter = regexObjectQuery('name');
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
