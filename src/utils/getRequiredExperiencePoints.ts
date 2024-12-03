import type CharacterActorA5E from '../documents/actor/character';

export default function getRequiredExperiencePoints(actor: CharacterActorA5E): number {
	if (actor.isType('character')) {
		let level = actor.levels?.character ?? 1;

		if (level < 1) level = 1;
		else if (level > 19) level = 19;

		return CONFIG.A5E.CHARACTER_EXP_LEVELS[level.toString()] ?? 0;
	}

	return 0;
}
