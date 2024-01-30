export default function prepareExpertiseDiceOptions(type = 'character') {
  const dieMap = [
    [0, game.i18n.localize('A5E.None')],
    [1, 'd4'],
    [2, 'd6'],
    [3, 'd8'],
    [4, 'd10'],
    [5, 'd12']
  ];

  if (type !== 'character') dieMap.push([6, 'd20']);
  return dieMap;
}
