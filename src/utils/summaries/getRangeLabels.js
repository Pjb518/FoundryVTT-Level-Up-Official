import { localize } from '#runtime/svelte/helper';

export default function getRangeLabels(action) {
  const ranges = action?.ranges;

  if (!Array.isArray(ranges)) return null;

  return Object.values(ranges).map(({ range, unit }) => {
    if (['short', 'medium', 'long'].includes(range)) {
      return `${CONFIG.A5E.rangeDescriptors[range]} (${localize(CONFIG.A5E.rangeValues[range])} ${CONFIG.A5E.distanceAbbreviations.feet})`;
    }

    if (['fiveFeet', 'self', 'touch'].includes(range)) return CONFIG.A5E.rangeDescriptors[range];

    return `${range} ${CONFIG.A5E.distanceAbbreviations[unit]}`;
  }).join(', ');
}
