import { localize } from '#runtime/util/i18n';

export default async function doubleDiceDamage(baseRoll) {
	const Terms = foundry.dice.terms;
	const diceDamage = baseRoll.dice.reduce((acc, die) => acc + die.total, 0);

	const terms = [
		...baseRoll.terms,
		await new Terms.OperatorTerm({ operator: '+' }).evaluate(),
		await new Terms.NumericTerm({
			number: diceDamage,
			options: { flavor: localize('A5E.CritDamage') },
		}).evaluate(),
	];

	return terms;
}
