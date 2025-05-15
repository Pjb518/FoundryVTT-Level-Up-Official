// eslint-disable-next-line import/no-unresolved
import { localize } from '#runtime/util/i18n';

export default function getSavingThrowPromptTitle(prompt, actorId) {
	const { abilities } = CONFIG.A5E;

	if (game.settings.get('a5e', 'protectRolls') ?? false) {
		// eslint-disable-next-line no-undef
		const actor = fromUuidSync(actorId);

		if (actor && actor.type !== 'character' && actor.permission < 2) {
			return localize('A5E.rollLabels.prompts.savingThrow', {
				ability: abilities[prompt.ability],
			});
		}
	}

	return localize('A5E.rollLabels.prompts.savingThrowWithDC', {
		ability: abilities[prompt.ability],
		dc: prompt.dc,
	});
}
