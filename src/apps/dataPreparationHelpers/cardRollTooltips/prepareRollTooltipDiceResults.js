export default function prepareRollTooltipDiceResults({ faces, results }, rollData) {
  return results.reduce((acc, { rerolled, discarded, result }) => {
    const isCritical = (faces === 20 && result >= rollData.critThreshold)
      || result === faces;

    const isDiscarded = discarded || rerolled;
    const isFumble = result === 1;

    let classes = `a5e-die a5e-die--${faces}`;

    if (isDiscarded) classes += ' discarded-die';
    else if (isFumble) classes += ' fumbled-die';
    else if (isCritical) classes += ' critical-die';

    return `${acc}<li class="${classes}">${result}</li>`;
  }, '');
}
