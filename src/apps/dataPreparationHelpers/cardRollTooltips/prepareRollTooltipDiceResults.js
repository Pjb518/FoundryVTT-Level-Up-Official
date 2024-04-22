export default function prepareRollTooltipDiceResults({ faces, results }, rollData) {
  return results.reduce((acc, { rerolled, discarded, result }) => {
    const isCritical = (faces === 20 && result >= rollData.critThreshold)
      || result === faces;

    const isDiscarded = discarded || rerolled;
    const isFumble = result === 1;

    let classes = `a5e-die a5e-die--${faces}`;

    if (isDiscarded) classes += ' a5e-die--discarded';
    else if (isFumble) classes += ' a5e-die--min';
    else if (isCritical) classes += ' a5e-die--max';

    return `${acc}<li class="${classes}">${result}</li>`;
  }, '');
}
