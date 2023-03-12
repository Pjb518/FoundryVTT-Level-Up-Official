import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default async function constructCritDamageRoll(baseRoll, critBonus) {
  const terms = [
    ...baseRoll.terms,
    await new OperatorTerm({ operator: '+' }).evaluate({ async: true }),
    await new NumericTerm({
      number: baseRoll.total,
      options: { flavor: localize('A5E.CritDamage') }
    }).evaluate({ async: true })
  ];

  if (critBonus) {
    const bonusDamageRoll = await new Roll(critBonus).evaluate({ async: true });

    terms.push(
      await new OperatorTerm({ operator: '+' }).evaluate({ async: true }),
      ...bonusDamageRoll.terms
    );
  }

  return Roll.fromTerms(terms);
}
