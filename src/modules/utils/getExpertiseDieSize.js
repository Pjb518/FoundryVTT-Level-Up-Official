/**
 * A helper function to convert the number of applicable expertise dice to a single expertise die.
 *
 * If no expertise dice are applicable or the diceQuantity is not valid, return null.
 *
 * @param {number} diceQuantity       The number of expertise dice that apply.
 * @param {boolean} includeDiePrefix  A boolean indicating whether to include the preceding "1"
 *                                    for the returned die size. Defaults to true.
 * @returns {?string}                 A single die calculated based on the number of applicable
 *                                    expertise dice.
 */
export default function getExpertiseDieSize(diceQuantity, includeDiePrefix=true) {
  let dieSize;

  if (diceQuantity === 1) dieSize = 'd4';
  else if (diceQuantity === 2) dieSize = 'd6';
  else if (diceQuantity === 3) dieSize = 'd8';
  else if (diceQuantity === 4) dieSize = 'd10';
  else if (diceQuantity >= 5) dieSize = "d12";
  else return null;

  return `${includeDiePrefix ? 1 : ""}${dieSize}`;
}
