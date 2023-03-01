export default function getMovementData(actor) {
  // eslint-disable-next-line no-unused-vars
  const { hover } = actor.system.attributes.movement.traits;
  const distances = Object.entries(actor.system.attributes.movement).filter(([mode, distance]) => {
    if (mode === "fly" && hover) { return true; }
    if (mode === "traits") { return false; }
    return distance;
  });

  const unit = game.i18n.localize('A5E.MeasurementFeetAbbr');
  const hoverText = game.i18n.localize('A5E.MovementHover');

  return distances.map(([mode, distance]) => {
    const modeLabel = game.i18n.localize(CONFIG.A5E.movement[mode]);

    if (mode == "fly" && hover) {
      return `${modeLabel} - ${distance || 0} ${unit} (${hoverText.toLocaleLowerCase()})`;
    } else {
      return `${modeLabel} - ${distance} ${unit}`;
    }
  });
}
