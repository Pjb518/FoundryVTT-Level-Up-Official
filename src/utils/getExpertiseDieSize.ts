/**
 * A helper function to convert the number of applicable expertise dice to a single expertise die.
 *
 * If no expertise dice are applicable or the diceQuantity is not valid, return null.
 */
export default function getExpertiseDieSize(
  diceQuantity: number,
  includeDiePrefix: boolean = true
): string | null {
  let dieSize: string;

  if (diceQuantity === 1) dieSize = 'd4';
  else if (diceQuantity === 2) dieSize = 'd6';
  else if (diceQuantity === 3) dieSize = 'd8';
  else if (diceQuantity === 4) dieSize = 'd10';
  else if (diceQuantity >= 5) dieSize = 'd12';
  else return null;

  return `${includeDiePrefix ? 1 : ''}${dieSize}`;
}
