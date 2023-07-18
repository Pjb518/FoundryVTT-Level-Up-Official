/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

export default async function doubleDiceQuantity(baseRoll) {
  const preProcessedRoll = baseRoll.clone();
  const terms = [];
  for (const term of preProcessedRoll.terms) {
    if (!(term instanceof MathTerm)) {
      terms.push(term);
      continue;
    }

    await term.evaluate({ async: true });
    const newTerm = new NumericTerm({ number: term.total ?? 0, options: term.options });
    terms.push(newTerm);
  }

  const parsedFormula = Roll.getFormula(terms);
  const roll = new Roll(parsedFormula, baseRoll.data);

  roll.alter(2, 0, { multiplyNumeric: false });
  await roll.evaluate({ async: true });

  return roll.terms;
}
