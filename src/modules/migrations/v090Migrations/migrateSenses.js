export default function migrateSenses(actorData, updateData) {
  const old = actorData?.system?.attributes?.senses;

  const newSenses = Object.entries(old).reduce((acc, [sense, distance]) => {
    const mileUnits = ['mile', 'miles', 'mi.', 'mi'];
    const meterUnits = ['meter', 'meters', 'm.', 'm'];
    const kilometerUnits = ['kilometer', 'kilometers', 'km.', 'km'];
    const unlimitedUnits = ['unlimited', 'infinite'];

    if (mileUnits.some((el) => distance.includes(el))) {
      acc[sense] = { distance: Number(parseInt(distance, 10)), unit: 'miles' };
      return acc;
    }
    if (kilometerUnits.some((el) => distance.includes(el))) {
      acc[sense] = { distance: Number(parseInt(distance, 10)), unit: 'kilometers' };
      return acc;
    }
    if (meterUnits.some((el) => distance.includes(el))) {
      acc[sense] = { distance: Number(parseInt(distance, 10)), unit: 'meters' };
      return acc;
    }
    if (unlimitedUnits.some((el) => distance.includes(el))) {
      acc[sense] = { unit: 'unlimited' };
      return acc;
    }
    acc[sense] = { distance: (Number(parseInt(distance, 10)) || 0), unit: 'feet' };

    return acc;
  }, {});

  updateData['system.attributes.senses'] = newSenses;

  return updateData;
}
