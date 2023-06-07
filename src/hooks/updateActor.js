export default function updateActor(actor, changes, options, userId) {
  const keys = Object.keys(changes).filter((k) => k !== '_id');
  const changed = new Set(keys);

  if (changed.has('ownership')) {
    actor._sheet = undefined;

    // Change token sheets as well.
    const tokens = actor.getActiveTokens();
    tokens.forEach((token) => { token.actor._sheet = undefined; });
  }
}
