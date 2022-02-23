/**
 * A helper function to determine if a range increment corresponds to one of the system's standard
 * ranges (e.g. 'short', 'long', 'touch', etc.)
 *
 * @param {String} range  A given range increment of an item.
 * @returns {Boolean}
 */
export default function isStandardRange(range) {
  return range !== 'other' && Object.keys(CONFIG.A5E.rangeDescriptors).includes(range);
}
