/**
 *
 * @param {Array} data
 * @returns {Array}
 */
export default function localeSort(data) {
  return data.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}
