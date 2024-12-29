import type { BaseActorA5e } from '../documents/actor/base';

import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function getMaxPrepared(
	actor: BaseActorA5e | undefined,
): number | null {
	if (!actor) return null;

	const maxPreparedValue = actor.items
		.filter(item => item.type === 'class')
		.map(item => getDeterministicBonus(item.system.spellcasting.maxPreparedFormula, actor.getRollData(item)))
		.reduce((acc, cur) => acc + cur, 0);

	return maxPreparedValue;
}
