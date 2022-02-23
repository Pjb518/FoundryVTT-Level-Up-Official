import isStandardRange from '../../../modules/utils/isStandardRange';

export default function prepareRangeSummary(rangeData) {
  const rangeSummary = Object.values(rangeData).reduce((acc, curr) => {
    if (isStandardRange(curr)) {
      if (['short', 'medium', 'long'].includes(curr)) {
        acc.push(`${CONFIG.A5E.rangeValues[curr]} ft.`);
      } else {
        acc.push(game.i18n.localize(CONFIG.A5E.rangeValues[curr]));
      }
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  return rangeSummary.filter(Boolean).join(' / ');
}
