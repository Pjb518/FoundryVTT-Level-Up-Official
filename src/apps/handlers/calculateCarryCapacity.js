export default function calculateCarryCapacity(actorData) {
  const strengthScore = actorData.system.abilities.str.value;
  const { size } = actorData.system.traits;
  const baseCarryCapacityMultiplier = CONFIG.A5E.carryCapacityMultiplier[size];
  const carryCapacityMultiplier = actorData.flags.a5e?.doubleCarryCapacity ? 2 : 1;

  return strengthScore * baseCarryCapacityMultiplier * carryCapacityMultiplier * 15;
}
