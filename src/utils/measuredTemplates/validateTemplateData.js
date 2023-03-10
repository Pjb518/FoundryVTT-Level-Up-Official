/**
 *
 * @param {Object} item
 * @param {String} actionId
 * @returns {Boolean} isValid
 */
export default function validateTemplateData(item, actionId) {
  const { area } = item.actions[actionId];

  if (!area?.shape) return false;
  if (!area.quantity || area.quantity <= 0) return false;

  if (area.shape === 'cone') {
    const length = Number(area?.length);
    if (!length || length <= 0) return false;
  } else if (area.shape === 'cube') {
    const size = Number(area?.width);
    if (!size || size <= 0) return false;
  } else if (area.shape === 'cylinder' || area.shape === 'sphere') {
    const radius = Number(area?.radius);
    if (!radius || radius <= 0) return false;
  } else if (area.shape === 'line') {
    const length = Number(area?.length);
    const width = Number(area?.width);

    if (!length || !width) return false;
    if (length <= 0 || width <= 0) return false;
  }

  return true;
}
