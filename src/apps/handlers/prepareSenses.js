export default function prepareSenses(data) {
  /* eslint-disable no-unused-vars */
  const senses = Object.entries(data.system.attributes.senses).filter(([_, { distance, unit }]) => distance || unit === 'unlimited');

  return senses.map(([name, senseData]) => {
    const label = game.i18n.localize(CONFIG.A5E.senses[name]);
    const unitLabel = game.i18n.localize(CONFIG.A5E.distanceAbbreviations[senseData.unit]);

    if (senseData.unit === 'unlimited') {
      const unlimitedLabel = game.i18n.localize(CONFIG.A5E.visionUnits.unlimited);
      return `${label} - ${unlimitedLabel}`;
    }
    return `${label} - ${senseData.distance} ${unitLabel}`;
  });
}
