export default function prepareCreatureTypes(data) {
  // eslint-disable-next-line max-len
  const types = data.system.details.creatureTypes.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  return types.map((type) => game.i18n.localize(CONFIG.A5E.creatureTypes[type] ?? type));
}
