export default function migrateToNewTemplateSyntax(itemData, updateData) {
  // Check for the presence of the old values
  const target = itemData?.data?.target;

  if (target.type === 'area') {
    updateData['data.target.type'] = '';

    if (!itemData.data.area.shape) {
      const area = target?.shape;
      const size = target?.size && target.size.match(/\d+/);

      if (area === 'cone') {
        updateData['data.area.length'] = size ? size[0] : '';
      } else if (area === 'line') {
        updateData['data.area.length'] = size ? size[0] : '';
        updateData['data.area.width'] = '5';
      } else if (area === 'sphere') {
        updateData['data.area.radius'] = size ? size[0] : '';
      } else if (area === 'cube') {
        updateData['data.area.width'] = size ? size[0] : '';
      } else if (area === 'cylinder') {
        if (size.length > 1) {
          const [radius, height] = size;
          updateData['data.area.radius'] = radius;
          updateData['data.area.height'] = height;
        } else {
          updateData['data.area.radius'] = size ? size[0] : '';
          updateData['data.area.height'] = '';
        }
      }

      updateData['data.area.shape'] = area || '';
    }
  }

  return updateData;
}
