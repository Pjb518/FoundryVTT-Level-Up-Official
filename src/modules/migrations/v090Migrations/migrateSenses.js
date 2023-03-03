export default function migrateSenses(actorData, updateData) {
  const old = actorData?.system?.attributes?.senses;

  const newSenses = Object.entries(old).reduce((acc, [sense, distance]) => {
    acc[sense] = { distance };
    return acc;
  }, {});

  updateData['system.attributes.senses'] = newSenses;

  return updateData;
}
