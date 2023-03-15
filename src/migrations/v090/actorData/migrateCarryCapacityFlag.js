export default function migrateCarryCapacityFlag(actorData, updateData) {
  const old = actorData?.flags?.a5e?.carryCapacityMultiplier;
  if (!old) return;

  if (old > 1) updateData.flags.a5e.doubleCarryCapacity = true;
  else updateData.flags.a5e.doubleCarryCapacity = false;
}
