import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/util/i18n';

export default function getAttunementLabel(item: ObjectItemA5e) {
	const { requiresAttunement, attuned, attunementRequirement } = item.system;

	if (!requiresAttunement) return '';
	if (attuned) return localize('A5E.Attuned');
	if (!item.actor) {
		if (!attunementRequirement) return localize('A5E.AttunementRequiredPrompt');
		return `${localize('A5E.AttunementRequiredPrompt')} ${attunementRequirement}`;
	}

	return `${localize('A5E.AttunementRequiredPrompt')} - ${localize('A5E.AttunedNot')}`;
}
