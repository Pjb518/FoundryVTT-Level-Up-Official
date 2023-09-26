/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-void */
/* eslint-disable no-control-regex */
/* eslint-disable no-restricted-syntax */
import { writable, get } from 'svelte/store';

function normalize(str) {
  return str.trim().normalize('NFD').replace(/[\x00-\x1F]/gm, '');
}

function escape(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isWritableStore(store) {
  if (store === null || store === void 0) { return false; }

  // eslint-disable-next-line default-case
  switch (typeof store) {
    case 'function':
    case 'object':
      return typeof store.subscribe === 'function' && typeof store.set === 'function';
  }

  return false;
}

function isIterable(value) {
  if (value === null || value === void 0 || typeof value !== 'object') {
    return false;
  }
  return Symbol.iterator in value;
}

function safeAccess(data, accessor, defaultValue) {
  if (typeof data !== 'object') {
    return defaultValue;
  }
  if (typeof accessor !== 'string') {
    return defaultValue;
  }
  const access = accessor.split('.');
  // Walk through the given object by the accessor indexes.
  // eslint-disable-next-line no-plusplus
  for (let cntr = 0; cntr < access.length; cntr++) {
    // If the next level of object access is undefined or null then return the empty string.
    if (typeof data[access[cntr]] === 'undefined' || data[access[cntr]] === null) {
      return defaultValue;
    }
    data = data[access[cntr]];
  }
  return data;
}

export default function regexObjectQuery(
  accessors,
  { accessWarn = false, caseSensitive = false, store } = {}
) {
  let keyword = '';
  let regex;

  if (store !== void 0 && !isWritableStore(store)) {
    throw new TypeError('createObjectQuery error: \'store\' is not a writable store.');
  }

  const storeKeyword = store || writable(keyword);

  // If an existing store is provided then set initial values.
  if (store) {
    const current = get(store);

    if (typeof current === 'string') {
      keyword = normalize(current);
      regex = new RegExp(escape(keyword), caseSensitive ? '' : 'i');
    } else {
      store.set(keyword);
    }
  }

  /**
   * If there is no filter keyword / regex then do not filter otherwise filter based on the regex
   * created from the search input element.
   *
   * @param {object} data - Data object to test against regex.
   *
   * @returns {boolean} AnimationStore filter state.
   */
  function filterQuery(data) {
    if (keyword === '' || !regex) { return true; }

    if (isIterable(accessors)) {
      for (const accessor of accessors) {
        const value = safeAccess(data.get(), accessor);
        if (typeof value !== 'string') {
          if (accessWarn) {
            console.warn(`regexObjectQuery warning: could not access string data from '${accessor}'.`);
          }

          continue;
        }

        if (regex.test(normalize(value))) { return true; }
      }

      return false;
    }

    const value = safeAccess(data.get(), accessors);

    if (typeof value !== 'string') {
      if (accessWarn) {
        console.warn(`regexObjectQuery warning: could not access string data from '${accessors}'.`);
      }

      return false;
    }

    return regex.test(normalize(value));
  }

  /**
   * Create a custom store that changes when the search keyword changes.
   *
   * @param {(string) => void} handler - A callback function that accepts strings.
   *
   * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
   */
  filterQuery.subscribe = (handler) => storeKeyword.subscribe(handler);

  /**
   * Set
   *
   * @param {string}   value - A new value for the keyword / regex test.
   */
  filterQuery.set = (value) => {
    if (typeof value === 'string') {
      keyword = normalize(value);
      regex = new RegExp(escape(keyword), caseSensitive ? '' : 'i');
      storeKeyword.set(keyword);
    }
  };

  return filterQuery;
}
