/**
 *
 * @param {*} document
 * @param {*} key
 * @returns {boolean}
 */
export default function determineIfPropertyModifiedByEffect(document: any, key: string): boolean {
  const overrides = document.overrides ?? {};
  // @ts-ignore Missing foundry variable
  return !!foundry.utils.getProperty(overrides, key);
}
