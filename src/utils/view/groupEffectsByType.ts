export function groupEffectsByType(effects: ActiveEffect[]) {
	const categories = {
		conditions: [] as ActiveEffect[],
		ongoing: [] as ActiveEffect[],
		inactive: [] as ActiveEffect[],
	};

	effects.forEach((effect) => {
		// Skip conditions
		if (effect.system.effectType === 'condition') return;

		if (!effect.active) categories.inactive.push(effect);
		else categories.ongoing.push(effect);
	});

	return categories;
}
