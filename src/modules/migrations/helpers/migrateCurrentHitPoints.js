export default function migrateCurrentHitPoints(actorData, updateData) {
  // Check for the presence of the old value.
  const old = actorData?.data?.attributes?.hp?.current;
  const hasOld = old !== undefined;

  if (hasOld) {
    // If new data is not present, migrate the old data
    const hasNew = actorData?.data?.attributes?.hp?.value !== undefined;

    if (!hasNew) updateData['data.attributes.hp.value'] = old || 0;

    // Remove the old attribute
    updateData['data.attributes.hp.-=current'] = null;
  }

  return updateData;
}
