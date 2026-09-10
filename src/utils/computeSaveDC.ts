import { getDeterministicBonus } from '../dice/getDeterministicBonus.ts';
import type { ItemA5e } from '../documents/item/item.ts';
import getSpellBookDC from './getSpellBookDC.ts';

export function computeSaveDC(
	actor: Actor.OfType<'base'> | undefined,
	item: ItemA5e,
	saveDC: { bonus: string; type: string },
): number | null {
	if (!actor) return null;
	console.log(actor);
	const rollData: object = actor.getRollData(item);
	const terms: (string | number)[] = [];

	if (saveDC?.type === 'spellcasting') {
		terms.push(getSpellBookDC(actor, item));
	} else if (saveDC?.type === 'maneuver') {
		terms.push(actor.system.attributes.maneuverDC);
	} else if (Object.keys(CONFIG.A5E.abilities).includes(saveDC?.type)) {
		terms.push(8, actor.system.attributes.prof, actor.system.abilities[saveDC?.type].check.mod);
	}

	if (saveDC.bonus) {
		terms.push(saveDC?.bonus);
	}

	return getDeterministicBonus(terms.join(' + '), rollData);
}
