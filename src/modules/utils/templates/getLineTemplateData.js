export default function getLineTemplateDate(item) {
  const length = Number(item.data.data.area?.length);
  const width = Number(item.data.data.area?.width);

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
