import type { BaseActorA5e } from '../documents/actor/base';

import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function getMaxPrepared(actor: BaseActorA5e | undefined): number {
	if (!actor) return 0;

	const override = actor.system.spellResources.maxPrepared ?? 0;
	if (override) {
		return override;
	}

	const maxPreparedValue = actor.items.reduce((acc, item) => {
		if (!item.isType('class') || !item.isType('archetype')) return acc;

		return (
			acc +
			(getDeterministicBonus(
				item.system.spellcasting.maxPreparedFormula,
				actor.getRollData(item),
			) ?? 0)
		);
	}, 0);

	return maxPreparedValue ?? 0;
}
