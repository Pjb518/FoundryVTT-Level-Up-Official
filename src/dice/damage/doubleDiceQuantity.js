export default async function doubleDiceQuantity(baseRoll) {
  const terms = [...baseRoll.terms];

  for await (const die of baseRoll.dice) {
    const operator = await new foundry.dice.terms.OperatorTerm({ operator: '+' }).evaluate();

    const newDie = await new foundry.dice.terms.Die({
      faces: die.faces, number: die.number, modifiers: die.modifiers, options: die.options
    }).evaluate();

    terms.push(operator, newDie);
  }

  return terms;
}
