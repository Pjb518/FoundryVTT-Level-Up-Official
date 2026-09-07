import type { ItemA5e } from '#documents/item/item.ts';
import { simplifyOperatorTerms } from './simplifyOperatorTerms.ts';

type Options = {
	actor: Actor.OfType<'base'>;
	formula?: string;
	item: ItemA5e;
	modifiers?: any;
};

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns  A valid roll formula that can be passed to Roll.
 */
export function constructRollFormula({ actor, formula, item, modifiers }: Options) {
	const rollData = actor.getRollData(item);

	const parts = [
		formula,
		...(modifiers ?? []).map(({ label, value }) => {
			if (!value || value === 0) return null;

			let modifier: any;
			try {
				modifier = new Roll(value.toString(), rollData);
			} catch (err) {
				return null;
			}

			modifier.terms.forEach((m) => {
				if (!['OperatorTerm', 'StringTerm'].includes(m.constructor.name))
					m.options.flavor ??= label;
			});

			return modifier.formula;
		}),
	];

	const { terms } = new Roll(parts.filter((part) => part && part !== '0').join(' + '), rollData);

	const simplifiedTerms = simplifyOperatorTerms(terms);

	return { rollFormula: Roll.getFormula(simplifiedTerms) };
}
