export default function calculateCarryCapacity(actorData) {
  const strengthScore = actorData.data.abilities.str.value;
  const { size } = actorData.data.traits;
  const baseCarryCapacityMultiplier = CONFIG.A5E.carryCapacityMultiplier[size];

  return strengthScore * baseCarryCapacityMultiplier * 15;
}
