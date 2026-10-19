export function getVehicleCapacity(actor: any) {
	const defaults =
		CONFIG.A5E.vehicleCapacity[actor.system.traits.size as 'lg'] ?? CONFIG.A5E.vehicleCapacity.lg;
	const capacity = actor.system.capacity ?? {};

	return {
		defaults,
		supply: (capacity.supply ?? defaults.supply) as number,
		bulky: (capacity.bulky ?? defaults.bulky) as number,
		carry: (capacity.carry ?? defaults.carry) as number,
	};
}
