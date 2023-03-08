export default function prepareCreatureSize(actor) {
  return [CONFIG.A5E.actorSizes[actor.system.traits.size]].map((size) => game.i18n.localize(size));
}
