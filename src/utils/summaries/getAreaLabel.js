import { localize } from '#runtime/svelte/helper';

import validateTemplateData from '../measuredTemplates/validateTemplateData';

export default function getAreaLabel(action) {
  const area = action?.area;
  let areaLabel = '';

  if (!validateTemplateData(action.area)) return null;

  if (area.shape === 'circle') {
    areaLabel = localize('A5E.AreaCircleSpecific', { radius: area.radius });
  } else if (area.shape === 'cone') {
    areaLabel = localize('A5E.AreaConeSpecific', { length: area.length });
  } else if (area.shape === 'cube') {
    areaLabel = localize('A5E.AreaCubeSpecific', { width: area.width });
  } else if (area.shape === 'cylinder' && area.height) {
    areaLabel = localize('A5E.AreaCylinderSpecific', { height: area.height, radius: area.radius });
  } else if (area.shape === 'cylinder') {
    areaLabel = localize('A5E.AreaCylinderSpecificNoHeight', { radius: area.radius });
  } else if (area.shape === 'line') {
    areaLabel = localize('A5E.AreaLineSpecific', { width: area.width ?? 5, length: area.length });
  } else if (area.shape === 'sphere') {
    areaLabel = localize('A5E.AreaSphereSpecific', { radius: area.radius });
  } else if (area.shape === 'square') {
    areaLabel = localize('A5E.AreaSquareSpecific', { width: area.width });
  } else {
    return null;
  }

  if (area.quantity > 1) areaLabel += `(× ${area?.quantity})`;

  return areaLabel;
}
