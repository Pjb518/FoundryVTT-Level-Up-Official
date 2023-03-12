export default function getLineTemplateDate(item, actionId) {
  const length = Number(item.actions[actionId]?.area?.length);
  const width = Number(item.actions[actionId]?.area?.width);

  return {
    direction: 0,
    distance: length,
    fillColor: game.user.color,
    t: 'ray',
    user: game.user.id,
    width,
    x: 0,
    y: 0
  };
}
