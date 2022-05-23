export default function getCircleTemplateData(item) {
  const size = Number(item.data.data.area.size);

  return {
    direction: 0,
    distance: size,
    fillColor: game.user.color,
    t: 'circle',
    user: game.user.id,
    x: 0,
    y: 0
  };
}
