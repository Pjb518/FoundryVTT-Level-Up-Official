import type { Action } from 'types/action';
import type { ItemA5e } from '../../documents/item/item';

import { localize } from '#runtime/util/i18n';

export default function getActivationCostLabel(item: ItemA5e, action: Action) {
	if (foundry.utils.isEmpty(action)) return '';

	const { activation } = action;
	let activationLabel = '';

	if (foundry.utils.isEmpty(activation) || !activation.type) return 'null';

	if (activation.type === 'reaction') {
		if (activation.reactionTrigger) {
			activationLabel = `${localize('A5E.ActionActivationReaction')} (${activation.reactionTrigger})`;
		} else {
			activationLabel = localize('A5E.ActionActivationReaction');
		}
	} else if (activation.cost === 0 || activation.cost > 1) {
		activationLabel = `${activation.cost} ${CONFIG.A5E.abilityActivationTypesPlural[activation.type]}`;
	} else if (['none', 'special'].includes(activation.type)) {
		activationLabel = CONFIG.A5E.abilityActivationTypes[activation?.type];
	} else {
		activationLabel = `${activation.cost ?? 1} ${CONFIG.A5E.abilityActivationTypes[activation.type]}`;
	}

	if (item.isType('spell') && item.system.ritual) activationLabel += ' (Ritual)';

	return activationLabel;
}
