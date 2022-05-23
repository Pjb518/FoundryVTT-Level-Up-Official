export default function getLineTemplateDate(item) {
  const size = Number(item.data.data.area.size);

  return {
    direction: 0,
    distance: size,
    fillColor: game.user.color,
    t: 'ray',
    user: game.user.id,
    width: canvas.dimensions.distance,
    x: 0,
    y: 0
  };
}
