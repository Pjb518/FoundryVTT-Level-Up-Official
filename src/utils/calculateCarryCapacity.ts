export function calculateCarryCapacity(actor: Actor) {
	const carryAbility = actor.getFlag('a5e', 'carryCapacityAbility') || 'str';

	const ablScore = actor.system.abilities[carryAbility].value;
	const { size } = actor.system.traits;
	const baseCarryCapacityMultiplier = CONFIG.A5E.carryCapacityMultiplier[size || 'med'];

	const carryCapacityMultiplier = actor.flags.a5e?.doubleCarryCapacity ? 2 : 1;

	return ablScore * baseCarryCapacityMultiplier * carryCapacityMultiplier * 15;
}
