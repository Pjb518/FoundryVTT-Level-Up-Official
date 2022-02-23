export default function migrateItemAreaConfiguration(itemData, updateData) {
  // Check for the presence of the old values
  const oldRange = itemData?.data?.range;

  if (!Array.isArray(oldRange)) {
    try {
      const { category, custom } = oldRange;

      if (category === 'other') updateData['data.range'] = [custom];
      else updateData['data.range'] = [category];

      updateData['data.range'] = updateData['data.range'].filter(Boolean);
    } catch (error) {
      console.error(`Failed range increment migration for Item ${itemData.name}`);
    }
  }

  return updateData;
}
