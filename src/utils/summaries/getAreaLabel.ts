import type { Action } from 'types/action';

import { localize } from '#runtime/util/i18n';

import validateTemplateData from '../measuredTemplates/validateTemplateData';

export default function getAreaLabel(action: Action) {
	const area = action?.area;
	let areaLabel: string;

	if (!validateTemplateData(action.area)) return '';

	if (area.shape === 'circle') {
		areaLabel = localize('A5E.area.circleSpecific', { radius: area.radius });
	} else if (area.shape === 'cone') {
		areaLabel = localize('A5E.area.coneSpecific', { length: area.length });
	} else if (area.shape === 'cube') {
		areaLabel = localize('A5E.area.cubeSpecific', { width: area.width });
	} else if (area.shape === 'cylinder' && area.height) {
		areaLabel = localize('A5E.area.cylinderSpecific', { height: area.height, radius: area.radius });
	} else if (area.shape === 'cylinder') {
		areaLabel = localize('A5E.area.cylinderSpecificNoHeight', { radius: area.radius });
	} else if (area.shape === 'emanation') {
		areaLabel = localize('A5E.area.emanationSpecific', { radius: area.radius });
	} else if (area.shape === 'line') {
		areaLabel = localize('A5E.area.lineSpecific', { width: area.width ?? 5, length: area.length });
	} else if (area.shape === 'sphere') {
		areaLabel = localize('A5E.area.sphereSpecific', { radius: area.radius });
	} else if (area.shape === 'square') {
		areaLabel = localize('A5E.area.squareSpecific', { width: area.width });
	} else if (area.shape === 'wall' && area.height && area.width) {
		areaLabel = localize('A5E.area.wallSpecific', {
			height: area.height,
			length: area.length,
			width: area.width,
		});
	} else if (area.shape === 'wall' && area.height) {
		areaLabel = localize('A5E.area.wallSpecificNoHeight', {
			height: area.height,
			length: area.length,
		});
	} else if (area.shape === 'wall' && area.width) {
		areaLabel = localize('A5E.area.wallSpecificNoHeight', {
			length: area.length,
			width: area.width,
		});
	} else if (area.shape === 'wall') {
		areaLabel = localize('A5E.area.wallSpecificNoWidthOrHeight', { length: area.length });
	} else {
		return '';
	}

	if (area.quantity > 1) areaLabel += `(× ${area?.quantity})`;

	return areaLabel;
}
