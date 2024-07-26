import type { Action } from 'types/action';

export default function getRangeLabels(action: Action) {
  const ranges = action?.ranges;
  const { distanceAbbreviations, rangeValues, rangeDescriptors } = CONFIG.A5E;

  if (foundry.utils.isEmpty(ranges)) return '';

  return Object.values(ranges).map(({ range, unit }) => {
    if (['short', 'medium', 'long'].includes(range)) {
      return `${rangeDescriptors[range]} (${rangeValues[range]} ${distanceAbbreviations.feet})`;
    }

    if (['fiveFeet', 'self', 'touch'].includes(range)) return rangeDescriptors[range];

    if (!unit) return range;

    return `${range} ${distanceAbbreviations[unit]}`;
  }).join(', ');
}
