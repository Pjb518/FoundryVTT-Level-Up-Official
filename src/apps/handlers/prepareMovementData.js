export default function getMovementData(data) {
  // eslint-disable-next-line no-unused-vars
  const hover = data.system.attributes.movement.traits.hover
  const speeds = Object.entries(data.system.attributes.movement).filter(([key, speed]) => {
    if(!speed && key === "fly" && hover){
      return !speed
    } else {
      return speed
    }
  }).filter(([key]) => key !== "traits");
  
  const unit = game.i18n.localize('A5E.MeasurementFeetAbbr');
  const hoverAbbr = game.i18n.localize('A5E.MovementHoverAbbr');

  return speeds.map(([name, speed]) => {
    const label = game.i18n.localize(CONFIG.A5E.movement[name]);
    if(name == "fly" && hover){
      return `${label} - ${speed || 0} ${unit} ${hoverAbbr}`;  
    } else {
      return `${label} - ${speed} ${unit}`;
    }
  });
}
