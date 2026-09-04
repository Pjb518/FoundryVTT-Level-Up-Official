import type { ItemA5e } from '#documents/item/item.ts';
import { simplifyOperatorTerms } from './simplifyOperatorTerms.ts';

type Options = {
	actor: Actor.OfType<'base'>;
	expertiseDie: number;
	item: ItemA5e | null;
	minRoll: number;
	maxRoll: number;
	modifiers: ({
		label?: string;
		value: string | number;
	} | null)[];
	rollMode: number;
};

/**
 * A helper function to construct a roll formula from an array of component values.
 *
 * Values which are undefined, null, or 0 are not included in the resulting formula, and some
 * arithmetic simplification is performed on the resulting formula for presentational purposes.
 *
 * @returns A valid roll formula that can be passed to Roll.
 */
export function constructD20RollFormula(options: Options) {
	const { rollMode, expertiseDie: expertise, minRoll: min, maxRoll: max } = options;
	const rollData = options.actor.getRollData(options.item);

	const parts = [
		'1d20',
		...(options.modifiers ?? []).map((m) => {
			if (!m) return null;
			const { value, label } = m;
			if (!value || value === 0) return null;

			let modifier: Roll<Record<string, any>>;

			try {
				modifier = new Roll<Record<string, any>>(value.toString(), rollData);
			} catch (err) {
				return null;
			}

			modifier.terms.forEach((m) => {
				if (m.constructor.name !== 'OperatorTerm') m.options.flavor ??= label;
			});

			return modifier.formula;
		}),
	];

	const formula = parts.filter((part) => part && part !== '0').join(' + ');

	const { terms } = new CONFIG.Dice.D20Roll(formula, rollData, { rollMode, expertise, min, max });
	const simplifiedTerms = simplifyOperatorTerms(terms);

	return { rollFormula: Roll.getFormula(simplifiedTerms) };
}
