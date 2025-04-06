export default async function maxDamage(baseRoll) {
  const maxRoll = baseRoll.clone();
  // await maxRoll.evaluate({ maximize: true });

  const newTerms = [];
  let wasDie = false;
  maxRoll.terms.forEach((term, idx) => {
    if (term instanceof foundry.dice.terms.Die) {
      newTerms.push(term);
      wasDie = true;
      return;
    }

    if (term instanceof foundry.dice.terms.OperatorTerm && wasDie === true) {
      const nextTerm = maxRoll.terms.at(idx + 1);

      if (nextTerm && nextTerm instanceof foundry.dice.terms.Die) {
        newTerms.push(term);
        wasDie = false;
      }
    }
  });

  const newRoll = Roll.fromTerms(newTerms);
  await newRoll.evaluate({ maximize: true });

  return [
    ...newRoll.terms,
    new foundry.dice.terms.OperatorTerm({ operator: "+" }),
    ...baseRoll.terms,
  ];
}
