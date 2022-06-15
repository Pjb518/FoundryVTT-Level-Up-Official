export default function calculateCarryCapacity(actorData) {
  const strengthScore = actorData.data.abilities.str.value;
  const { size } = actorData.data.traits;
  const baseCarryCapacityMultiplier = CONFIG.A5E.carryCapacityMultiplier[size];
  const carryCapacityMultiplier = Number(actorData.flags.a5e?.carryCapacityMultiplier) || 1;

  return strengthScore * baseCarryCapacityMultiplier * carryCapacityMultiplier * 15;
}
