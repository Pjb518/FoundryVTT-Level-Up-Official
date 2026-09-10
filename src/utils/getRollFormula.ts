import { constructD20RollFormula } from '../dice/constructD20RollFormula.ts';
import { ModifierManager } from '../managers/ModifierManager.ts';

export function getRollFormula(
	actor: Actor.OfType<'base'>,
	rollData?: ModifierManager.RollData,
	options?: { terms: false },
): string;

export function getRollFormula(
	actor: Actor.OfType<'base'>,
	rollData: ModifierManager.RollData | undefined,
	options: { terms: true },
): { rollFormula: string; terms: foundry.dice.terms.RollTerm[] };

export function getRollFormula(
	actor: Actor.OfType<'base'>,
	rollData = {} as ModifierManager.RollData,
	options = { terms: false },
) {
	const modifierManager = new ModifierManager(actor, rollData);

	const formula = constructD20RollFormula({
		actor,
		rollMode: rollData.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
		expertiseDie: rollData.expertiseDie ?? 0,
		minRoll: rollData.minRoll ?? -Infinity,
		maxRoll: rollData.maxRoll ?? Infinity,
		item: rollData.item ?? null,
		modifiers: modifierManager.getModifiers(),
	});

	if (options.terms) return formula;
	return formula.rollFormula;
}
