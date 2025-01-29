import type { Action } from 'types/action';

import { localize } from '#runtime/util/i18n';

export default function getTargetLabel(action: Action) {
	const target = action?.target;

	if (foundry.utils.isEmpty(target) || !target.type || target.type === 'none') return '';

	let heardOrSeen = '';

	if (target.heard && !target.seen) heardOrSeen = ` (${localize('A5E.TargetHeard')})`;
	else if (target.seen && !target.heard) heardOrSeen = ` (${localize('A5E.TargetSeen')})`;
	else if (target.heard && target.seen) heardOrSeen = ` (${localize('A5E.TargetHeard')} or ${localize('A5E.TargetSeen')})`;

	if (target.type === 'self') return localize('A5E.TargetSelf');
	if (target.type === 'other'  && target.otherText === '') return localize('A5E.TargetOther') + heardOrSeen;
	if (target.type === 'other'  && target.otherText !== '') return target.otherText + heardOrSeen;

	if (target.quantity === 0 || target.quantity > 1) {
		return `${target.quantity} ${CONFIG.A5E.targetTypesPlural[target.type]}` + heardOrSeen;
	}

	return `${target.quantity || 1} ${CONFIG.A5E.targetTypes[target.type]}` + heardOrSeen;
}
