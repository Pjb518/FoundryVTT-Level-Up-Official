export default function prepareSenses(data) {
  const senses = Object.entries(
    data.system.attributes.senses
  ).filter(
    ([sense, senseData]) => (
      (sense === 'blindsight' && senseData.otherwiseBlind)
      || senseData.distance
      || senseData.unit === 'unlimited'
    )
  );

  return senses.map(([sense, senseData]) => {
    const label = game.i18n.localize(CONFIG.A5E.senses[sense]);
    const unitLabel = game.i18n.localize(CONFIG.A5E.distanceAbbreviations[senseData.unit]);

    if (sense === 'blindsight' && senseData.otherwiseBlind) {
      return `${label} - ${senseData.distance} ${unitLabel || 'ft.'} (Blind Beyond)`;
    }

    if (senseData.unit === 'unlimited') {
      const unlimitedLabel = game.i18n.localize(CONFIG.A5E.visionUnits.unlimited);
      return `${label} - ${unlimitedLabel}`;
    }

    return `${label} - ${senseData.distance} ${unitLabel || 'ft.'}`;
  });
}
