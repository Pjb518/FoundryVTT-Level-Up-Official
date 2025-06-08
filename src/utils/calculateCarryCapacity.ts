export function calculateCarryCapacity(actor: Actor) {
  const strengthScore = actor.system.abilities.str.value;
  const { size } = actor.system.traits;
  const baseCarryCapacityMultiplier =
    CONFIG.A5E.carryCapacityMultiplier[size || "med"];

  const carryCapacityMultiplier = actor.flags.a5e?.doubleCarryCapacity ? 2 : 1;

  return (
    strengthScore * baseCarryCapacityMultiplier * carryCapacityMultiplier * 15
  );
}
