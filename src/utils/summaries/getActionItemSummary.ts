import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';

export function getActionItemSummary(item: ActionItem, options: Record<string, any>) {
	return {
		armorClassData: getArmorClassData(item),
	};
}

/** Gets AC Data for an item as a string. */
function getArmorClassData(item: ActionItem) {
	// @ts-expect-error AC doesn't exist on hacking and interaction items
	const ac = item.system.ac ?? {};
	let acValue = ac.formula;
	if (!acValue || acValue === '0') return '';

	if (item.actor) acValue = getDeterministicBonus(acValue, item.actor.getRollData(item));

	const acData: string[] = [`AC ${acValue}`];

	if (ac.maxDex) acData.push(`Max Dexterity Bonus of ${ac.maxDex}`);
	if (ac.minStr) acData.push(`Requires ${ac.minStr} Strength`);
	if (ac.grantsDisadvantage) acData.push('Grants Disadvantage');

	return acData.join('; ');
}
