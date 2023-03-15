/**
 *
 * @param {Object} item
 * @param {String} actionId
 * @returns {Boolean} isValid
 */
export default function validateTemplateData(item, actionId) {
  const { area } = item.actions[actionId] ?? {};

  if (foundry.utils.isEmpty(area)) return false;

  area.quantity ??= 1;

  if (!area?.shape) return false;
  if (area.quantity <= 0) return false;

  if (area.shape === 'cone') {
    const length = parseInt(area?.length, 10);
    if (!length || length <= 0) return false;
  } else if (area.shape === 'cube') {
    const size = parseInt(area?.width, 10);
    if (!size || size <= 0) return false;
  } else if (area.shape === 'cylinder' || area.shape === 'sphere') {
    const radius = parseInt(area?.radius, 10);
    if (!radius || radius <= 0) {
      return false;
    }
  } else if (area.shape === 'line') {
    const length = parseInt(area?.length, 10);
    const width = parseInt(area?.width, 10);

    if (!length || !width) return false;
    if (length <= 0 || width <= 0) return false;
  }

  return true;
}
