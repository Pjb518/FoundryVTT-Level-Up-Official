export default async function getBonusCritDamage(critBonus) {
  const bonusDamageRoll = await new Roll(critBonus).evaluate();

  return [
    await new foundry.dice.terms.OperatorTerm({ operator: '+' }).evaluate(),
    ...bonusDamageRoll.terms
  ];
}
