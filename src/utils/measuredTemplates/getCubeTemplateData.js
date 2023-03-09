export default function getCubeTemplateData(item, actionId) {
  const size = Number(item.actions[actionId]?.area.width);

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
