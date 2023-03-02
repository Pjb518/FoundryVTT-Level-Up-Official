export default function migrateItemAreaConfiguration(itemData, updateData) {
  // Check for the presence of the old values
  const oldShape = itemData?.data?.target?.shape;
  const oldSize = itemData?.data?.target?.size;

  if (oldShape) {
    updateData['data.target.-=shape'] = null;
    updateData['data.area.shape'] = oldShape;
  }

  if (oldSize) {
    updateData['data.target.-=size'] = null;
    updateData['data.area.size'] = oldSize;
  }

  return updateData;
}
