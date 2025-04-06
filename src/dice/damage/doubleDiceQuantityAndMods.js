export default async function doubleDiceQuantityAndMods(baseRoll) {
  const Terms = foundry.dice.terms;

  const terms = [];

  for await (const term of baseRoll.terms) {
    if (
      !(term instanceof Terms.FunctionTerm || term instanceof Terms.NumericTerm)
    ) {
      terms.push(term);
      continue;
    }

    const die = await new Terms.NumericTerm({
      number: term.total * 2,
      options: term.options,
    }).evaluate();

    terms.push(die);
  }

  for await (const die of baseRoll.dice) {
    const operator = new Terms.OperatorTerm({ operator: "+" });

    const newDie = await new Terms.Die({
      faces: die.faces,
      number: die.number,
      modifiers: die.modifiers,
      options: die.options,
    }).evaluate();

    terms.push(operator, newDie);
  }

  return terms;
}
