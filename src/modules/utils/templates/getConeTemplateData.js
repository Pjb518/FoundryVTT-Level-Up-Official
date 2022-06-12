export default function getConeTemplateData(item) {
  const length = Number(item.data.data.area.length);

  return {
    angle: CONFIG.MeasuredTemplate.defaults.angle,
    direction: 0,
    distance: length,
    fillColor: game.user.color,
    t: 'cone',
    user: game.user.id,
    x: 0,
    y: 0
  };
}
