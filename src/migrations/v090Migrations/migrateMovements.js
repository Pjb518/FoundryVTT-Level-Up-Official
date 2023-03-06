export default function migrateMovements(actorData, updateData) {
  const old = actorData?.system?.attributes?.movement;
  const unitMap = {
    miles: ['mile', 'miles', 'mi.', 'mi'],
    kilometers: ['kilometer', 'kilometers', 'km.', 'km'],
    meters: ['meter', 'meters', 'm.', 'm']
  };

  const newMovements = Object.entries(old).reduce((acc, [mode, distance]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [unit, strings] of Object.entries(unitMap)) {
      if (strings.some((el) => distance.includes(el))) {
        acc[mode] = { distance: (Number(parseInt(distance, 10))), unit };
        return acc;
      }
    }

    return acc;
  }, {});
  
  updateData['system.attributes.movement'] = newMovements;

  return updateData;
}
