// eslint-disable-next-line import/no-unresolved
import { localize } from '#runtime/util/i18n';

export default function getAbilityCheckPromptTitle(prompt) {
	const { abilities } = CONFIG.A5E;

	return localize('A5E.abilities.headings.checkSpecific', {
		ability: abilities[prompt.ability],
	});
}
