/**
 *
 * @param {*} document
 * @param {*} key
 * @returns {boolean}
 */
export function determineIfPropertyModifiedByEffect(
  document: any,
  key: string,
): boolean {
  const overrides = document.overrides ?? {};
  return !!foundry.utils.getProperty(overrides, key);
}
