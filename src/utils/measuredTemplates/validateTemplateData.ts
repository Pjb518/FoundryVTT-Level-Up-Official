export default function validateTemplateData(area: TemplateArea): boolean {
  if (foundry.utils.isEmpty(area)) return false;

  area.quantity ??= 1;

  if (!area?.shape) return false;
  if (area.quantity <= 0) return false;

  if (area.shape === 'cone') {
    let length: number;

    if ((area as ConeArea).length) length = parseInt((area as ConeArea)?.length, 10);
    if (!length || length <= 0) return false;
  } else if (area.shape === 'cube' || area.shape === 'square') {
    const size = parseInt(area?.width, 10);
    if (!size || size <= 0) return false;
  } else if (['circle', 'cylinder', 'sphere'].includes(area.shape)) {
    const radius = parseInt(area?.radius, 10);
    if (!radius || radius <= 0) return false;
  } else if (area.shape === 'line') {
    const length = parseInt(area?.length, 10);
    const width = parseInt(area?.width, 10);

    if (!length || !width) return false;
    if (length <= 0 || width <= 0) return false;
  }

  return true;
}
