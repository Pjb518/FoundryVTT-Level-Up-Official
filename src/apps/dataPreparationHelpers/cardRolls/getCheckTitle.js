// eslint-disable-next-line import/no-unresolved
import { localize } from '#runtime/util/i18n';

export default function getCheckLabel(messageData) {
	const { abilities, skills } = CONFIG.A5E;
	const { abilityKey, saveType, skillKey } = messageData;
	const ability = localize(abilities[abilityKey]);
	const skill = skills[skillKey];

	switch (messageData.cardType) {
		case 'abilityCheck':
			return localize('A5E.AbilityCheckSpecific', { ability });
		case 'hitDice':
			return messageData.title;
		case 'savingThrow':
			switch (saveType) {
				case 'concentration':
					return localize('A5E.rollLabels.concentrationCheck');
				case 'death':
					return localize('A5E.deathSavingThrow.title');
				default:
					return localize('A5E.rollLabels.prompts.savingThrow', { ability });
			}
		case 'skillCheck':
			return ability
				? localize('A5E.skillLabels.checks.ability', { skill, ability })
				: localize('A5E.skillLabels.checks.skillSpecific', { skill });
		default:
			return null;
	}
}
