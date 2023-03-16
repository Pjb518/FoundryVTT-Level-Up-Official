export default function migrateSenses(actorData, updateData) {
  const old = actorData?.system?.attributes?.senses;
  const unitMap = {
    miles: ['mile', 'miles', 'mi.', 'mi'],
    kilometers: ['kilometer', 'kilometers', 'km.', 'km'],
    meters: ['meter', 'meters', 'm.', 'm'],
    unlimited: ['unlimited', 'infinite']
  };

  const newSenses = Object.entries(old ?? {}).reduce((acc, [sense, distance]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [unit, strings] of Object.entries(unitMap)) {
      if (strings.some((el) => distance.toString().includes(el))) {
        acc[sense] = { distance: parseInt(distance, 10), unit };
        return acc;
      }
    }

    acc[sense] = { distance: parseInt(distance, 10), unit: 'feet' };
    return acc;
  }, {});

  updateData['system.attributes.senses'] = newSenses;

  return updateData;
}
