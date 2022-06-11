export default function getCircleTemplateData(item) {
  const radius = Number(item.data.data.area.radius);

  return {
    direction: 0,
    distance: radius,
    fillColor: game.user.color,
    t: 'circle',
    user: game.user.id,
    x: 0,
    y: 0
  };
}
