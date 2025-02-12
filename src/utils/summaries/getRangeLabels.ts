import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel';

export default function getRangeLabels(action: A5EActionData) {
	const ranges = action?.ranges;
	const { distanceAbbreviations, rangeValues, rangeDescriptors } = CONFIG.A5E;

	if (foundry.utils.isEmpty(ranges)) return '';

	// @ts-expect-error
	return Object.values(ranges)
		.map(({ range, unit }) => {
			if (['short', 'medium', 'long'].includes(range)) {
				return `${rangeDescriptors[range]} (${rangeValues[range]} ${distanceAbbreviations.feet})`;
			}

			if (['fiveFeet', 'self', 'touch'].includes(range)) return rangeDescriptors[range];

			if (!unit) return range;

			return `${range} ${distanceAbbreviations[unit]}`;
		})
		.join(', ');
}
