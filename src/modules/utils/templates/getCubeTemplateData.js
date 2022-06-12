export default function getCubeTemplateData(item) {
  const size = Number(item.data.data.area.width);

  return {
    direction: 45,
    distance: Math.hypot(size, size),
    fillColor: game.user.color,
    t: 'rect',
    user: game.user.id,
    width: size,
    x: 0,
    y: 0
  };
}
