import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/util/i18n';

export default function getAttunementLabel(item: ObjectItemA5e) {
	const { requiresAttunement, attuned, attunementHint } = item.system;

	if (!requiresAttunement) return '';
	if (attuned) return localize('A5E.attument.headings.attuned');
	if (!item.actor) {
		if (!attunementHint) return localize('A5E.attument.headings.requiredPrompt');
		return `${localize('A5E.attument.headings.requiredPrompt')} ${attunementHint}`;
	}

	return `${localize('A5E.attument.headings.requiredPrompt')} - ${localize('A5E.attument.headings.not')}`;
}
