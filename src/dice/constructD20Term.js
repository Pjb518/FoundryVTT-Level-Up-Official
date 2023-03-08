export default function constructD20Term({ actor, minRoll, rollMode }) {
  let d20Term = '1d20';

  if ([CONFIG.A5E.ROLL_MODE.ADVANTAGE, CONFIG.A5E.ROLL_MODE.DISADVANTAGE].includes(rollMode)) {
    d20Term = '2d20';
  }

  if (actor?.flags?.a5e?.halflingLuck) d20Term += 'r1';

  if (minRoll > 1) d20Term += `min${minRoll}`;

  if (rollMode === CONFIG.A5E.ROLL_MODE.ADVANTAGE) d20Term += 'kh';
  else if (rollMode === CONFIG.A5E.ROLL_MODE.DISADVANTAGE) d20Term += 'kl';

  return d20Term;
}
