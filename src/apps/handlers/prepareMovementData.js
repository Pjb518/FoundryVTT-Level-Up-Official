export default function getMovementData(data) {
  // eslint-disable-next-line no-unused-vars
  const speeds = Object.entries(data.system.attributes.movement).filter(([_, speed]) => speed);
  const unit = game.i18n.localize('A5E.MeasurementFeetAbbr');

  return speeds.map(([name, speed]) => {
    const label = game.i18n.localize(CONFIG.A5E.movement[name]);
    return `${label} - ${speed} ${unit}`;
  });
}
