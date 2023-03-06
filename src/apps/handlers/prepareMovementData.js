export default function getMovementData(actor) {
  // eslint-disable-next-line no-unused-vars
  const hover = actor.system.attributes.movement?.traits?.hover;

  const distances = Object.entries(actor.system.attributes.movement).filter(([mode, movementData]) => {
    if (mode === 'fly' && hover) { return true; }
    if (mode === 'traits') { return false; }
    if (movementData.distance === 0) { return false; }
    return movementData;
  });

  console.log(distances);

  const hoverText = game.i18n.localize('A5E.MovementHover');
  console.log();

  return distances.map(([mode, movementData]) => {
    const modeLabel = game.i18n.localize(CONFIG.A5E.movement[mode]);
    const unitLabel = game.i18n.localize(CONFIG.A5E.distanceAbbreviations[movementData.unit]);

    if (mode === 'fly' && hover) {
      return `${modeLabel} - ${movementData.distance || 0} ${unitLabel} (${hoverText.toLocaleLowerCase()})`;
    }
    return `${modeLabel} - ${movementData.distance} ${unitLabel || 'ft.'}`;
  });
}
