export default function migrateSenses(actorData, updateData) {
  const old = actorData?.system?.attributes?.senses;
  const unitMap = {
    miles: ['mile', 'miles', 'mi.', 'mi'],
    kilometers: ['kilometer', 'kilometers', 'km.', 'km'],
    meters: ['meter', 'meters', 'm.', 'm'],
    unlimited: ['unlimited', 'infinite']
  };

  const newSenses = Object.entries(old).reduce((acc, [sense, distance]) => {
    for (const [unit, strings] of Object.entries(unitMap)) {
      if (strings.some((el) => distance.includes(el))) {
        acc[sense] = { distance: (Number(parseInt(distance, 10)) || 0), unit };
        return acc;
      }
    }

    return acc;
  }, {});

  updateData['system.attributes.senses'] = newSenses;

  return updateData;
}
