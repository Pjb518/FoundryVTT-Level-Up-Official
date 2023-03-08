export default function migrateItemWeight(itemData, updateData) {
  if (itemData.type !== 'object') return;
  if (!itemData.system.weight?.length) return;

  // Extract numbers from string
  const weightString = itemData.system.weight;
  const matches = weightString.match(/\d+/);

  const weight = matches ? Number(matches[0]) : 0;

  updateData['system.weight'] = weight;
}
