export default function migrateUsesMax(itemData, updateData) {
  const { uses } = itemData.system;
  if (!uses?.max || uses?.max === '') return;

  updateData['system.uses.max'] = uses.max?.toString();
}
