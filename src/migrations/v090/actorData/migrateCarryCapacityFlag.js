export default function migrateCarryCapacityFlag(actorData, updateData) {
  const old = actorData?.flags?.a5e?.carryCapacityMultiplier;
  if (!old) return;

  foundry.utils.setProperty(updateData, 'flags.a5e.doubleCarryCapacity', old > 1);
}
