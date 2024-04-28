export default async function getBonusCritDamage(critBonus) {
  const bonusDamageRoll = await new Roll(critBonus).evaluate();

  return [
    await new OperatorTerm({ operator: '+' }).evaluate(),
    ...bonusDamageRoll.terms
  ];
}
