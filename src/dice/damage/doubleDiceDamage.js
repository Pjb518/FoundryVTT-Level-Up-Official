import { localize } from "#utils/localization/localize.ts";

export default async function doubleDiceDamage(baseRoll) {
  const Terms = foundry.dice.terms;
  const diceDamage = baseRoll.dice.reduce((acc, die) => acc + die.total, 0);

  const terms = [
    ...baseRoll.terms,
    new Terms.OperatorTerm({ operator: "+" }),
    await new Terms.NumericTerm({
      number: diceDamage,
      options: { flavor: localize("A5E.CritDamage") },
    }).evaluate(),
  ];

  return terms;
}
