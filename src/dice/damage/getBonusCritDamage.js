export default async function getBonusCritDamage(critBonus) {
  const bonusDamageRoll = await new Roll(critBonus).evaluate();

  return [
    new foundry.dice.terms.OperatorTerm({ operator: "+" }),
    ...bonusDamageRoll.terms,
  ];
}
