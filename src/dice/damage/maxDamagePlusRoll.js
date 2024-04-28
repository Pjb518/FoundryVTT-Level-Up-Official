export default async function maxDamage(baseRoll) {
  const maxRoll = baseRoll.clone();
  await maxRoll.evaluate({ maximize: true });

  return [
    ...maxRoll.terms,
    await new OperatorTerm({ operator: '+' }).evaluate(),
    ...baseRoll.terms
  ];
}
