export default function getRangeLabels(action) {
  const ranges = action?.ranges;
  const { distanceAbbreviations, rangeValues, rangeDescriptors } = CONFIG.A5E;

  if (foundry.utils.isEmpty(ranges)) return null;

  return Object.values(ranges).map(({ range, unit }) => {
    if (['short', 'medium', 'long'].includes(range)) {
      return `${rangeDescriptors[range]} (${rangeValues[range]} ${distanceAbbreviations.feet})`;
    }

    if (['fiveFeet', 'self', 'touch'].includes(range)) return rangeDescriptors[range];

    return `${range} ${distanceAbbreviations[unit]}`;
  }).join(', ');
}
