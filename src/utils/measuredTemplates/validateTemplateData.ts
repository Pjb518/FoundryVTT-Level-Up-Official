export default function validateTemplateData(area: TemplateArea): boolean {
  if (foundry.utils.isEmpty(area)) return false;

  area.quantity ??= 1;

  if (!area?.shape) return false;
  if (area.quantity <= 0) return false;

  if (area.shape === 'cone' || area.shape === 'wall') {
    let length = (area as ConeArea | WallArea)?.length;
    if (typeof length === 'string') length = parseInt(length, 10);
    if (!length || length <= 0) return false;
  } else if (area.shape === 'cube' || area.shape === 'square') {
    let size = (area as CubeArea | SquareArea)?.width;
    if (typeof size === 'string') size = parseInt(size, 10);
    if (!size || size <= 0) return false;
  } else if (['circle', 'cylinder', 'emanation', 'sphere'].includes(area.shape)) {
    let radius = (area as CircleArea | CylinderArea | EmanationArea | SphereArea)?.radius;
    if (typeof radius === 'string') radius = parseInt(radius, 10);
    if (!radius || radius <= 0) return false;
  } else if (area.shape === 'line') {
    let length = (area as LineArea)?.length;
    let width = (area as LineArea)?.width;

    if (typeof length === 'string') length = parseInt(length, 10);
    if (typeof width === 'string') width = parseInt(width, 10);

    if (!length || !width) return false;
    if (length <= 0 || width <= 0) return false;
  }

  return true;
}
