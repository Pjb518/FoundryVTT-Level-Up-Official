export default function prepareSenses(data) {
  /* eslint-disable no-unused-vars */
  const senses = Object.entries(data.data.attributes.senses).filter(([_, range]) => range);
  const unit = game.i18n.localize('A5E.MeasurementFeetAbbr');

  return senses.map(([name, range]) => {
    const label = game.i18n.localize(CONFIG.A5E.senses[name]);
    return `${label} - ${range} ${unit}`;
  });
}
