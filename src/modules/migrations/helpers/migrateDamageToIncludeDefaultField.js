export default function migrateDamageToIncludeDefaultField(itemData, updateData) {
  const damage = itemData?.data?.damage;
  const healing = itemData?.data?.healing;

  updateData['data.damage'] = damage.map((damageSource) => {
    if (damageSource.defaultSelection === undefined) {
      damageSource.defaultSelection = true;
    }

    return damageSource;
  });

  updateData['data.healing'] = healing.map((healingSource) => {
    if (healingSource.defaultSelection === undefined) {
      healingSource.defaultSelection = true;
    }

    return healingSource;
  });

  return updateData;
}
