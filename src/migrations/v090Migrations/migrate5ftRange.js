import isStandardRange from '../../utils/isStandardRange';

/**
 *
 * @param {String} range
 * @param {Object} updateData
 * @returns {String}
 */
export default function migrate5ftRange(range) {
  if (isStandardRange(range)) {
    return range;
  }

  const ftInString = range.toLowerCase().includes('ft');
  if (!ftInString) return range;

  const matches = range.match(/\d+/);

  // eslint-disable-next-line no-param-reassign
  range = matches && Number(matches[0]) === 5 ? 'fiveFeet' : range;
  return range;
}
