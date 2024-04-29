import { localize } from '#runtime/svelte/helper';

export default async function doubleRolledDamage(baseRoll) {
  const Terms = foundry.dice.terms;

  const terms = [
    ...baseRoll.terms,
    await new Terms.OperatorTerm({ operator: '+' }).evaluate(),
    await new Terms.NumericTerm({
      number: baseRoll.total,
      options: { flavor: localize('A5E.CritDamage') }
    }).evaluate()
  ];

  return terms;
}
