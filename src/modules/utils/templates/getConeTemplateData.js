export default function getConeTemplateData(item) {
  const size = Number(item.data.data.area.size);

  return {
    angle: CONFIG.MeasuredTemplate.defaults.angle,
    direction: 0,
    distance: size,
    fillColor: game.user.color,
    t: 'cone',
    user: game.user.id,
    x: 0,
    y: 0
  };
}
