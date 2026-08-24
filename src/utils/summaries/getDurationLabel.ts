import type { Action } from 'types/action';
import { localize } from '#utils/localization/localize.ts';
import { getDeterministicBonus } from '../../dice/getDeterministicBonus';
import type { ItemA5e } from '../../documents/item/item';

export default function getDurationLabel(item: ItemA5e, action: Action) {
	const { duration } = action;

	let durationLabel = '';
	const numericValue = item.actor
		? (getDeterministicBonus(duration.value ?? '0', item.actor.getRollData(item)) ?? 0)
		: 0;

	if (foundry.utils.isEmpty(duration) || !duration.unit) return '';

	if (['instantaneous', 'permanent', 'special'].includes(duration.unit)) {
		durationLabel = CONFIG.A5E.timePeriods[duration.unit];
	} else if (numericValue === 0 || numericValue > 1) {
		durationLabel = `${(numericValue || duration.value) ?? 1} ${CONFIG.A5E.timePeriodsPlural[duration.unit]}`;
	} else {
		durationLabel = `${(numericValue || duration.value) ?? 1} ${CONFIG.A5E.timePeriods[duration.unit]}`;
	}

	if (item.type === 'spell' && item?.system?.concentration) {
		durationLabel += ` (${localize('A5E.SpellConcentration')})`;
	}

	return durationLabel.trim();
}
