/**
 *
 * @param {*} document
 * @param {*} key
 * @returns {boolean}
 */
export default function determineIfPropertyModifiedByEffect(document, key) {
  const overrides = document.overrides ?? {};
  return !!foundry.utils.getProperty(overrides, key);
}
