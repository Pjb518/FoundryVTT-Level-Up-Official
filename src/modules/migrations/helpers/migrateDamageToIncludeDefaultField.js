export default function migrateDamageToIncludeDefaultField(itemData, updateData) {
  const damage = itemData?.data?.damage;

  updateData['data.damage'] = damage.map((damageSource) => {
    if (damageSource.defaultSelection === undefined) {
      damageSource.defaultSelection = true;
    }

    return damageSource;
  });

  return updateData;
}
