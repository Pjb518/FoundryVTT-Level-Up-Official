/**
  * Returns the AC components of an actor
 * @param {*} actor
 * @returns {String}
 */
export default function getACComponents(actor) {
  const baseChanges = actor.system.attributes.ac.changes;
  if (!baseChanges.overrides.length && !baseChanges.bonuses.length) return '';

  // Get ac base effects
  const effectChanges = actor.effects.reduce((acc, effect) => {
    const changes = effect.changes
      .reduce((changesAcc, change) => {
        if (effect.isSuppressed) return changesAcc;
        if (change.key !== 'system.attributes.ac.value') return changesAcc;

        changesAcc.push({
          name: effect.name,
          mode: change.mode,
          value: change.value,
          requiresUnarmored: false
        });
        return changesAcc;
      }, []);

    return acc.concat(changes);
  }, []);

  let changes;
  if (effectChanges.find(({ mode }) => mode === 5)) changes = effectChanges;
  else {
    changes = baseChanges.overrides.filter(({ isSuppressed }) => !isSuppressed)
      .concat(baseChanges.bonuses.filter(({ isSuppressed }) => !isSuppressed))
      .concat(effectChanges);
  }

  const components = changes
    .sort((a, b) => b.mode - a.mode)
    .map(({ mode, name, value }) => {
      // eslint-disable-next-line no-nested-ternary
      const sign = mode === 5
        ? ''
        : value >= 0
          ? '+'
          : '-';

      return `${sign} ${value} [${name}]`;
    });

  return components.join(' ');
}
