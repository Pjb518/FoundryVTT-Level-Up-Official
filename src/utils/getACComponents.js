import getDeterministicBonus from '../dice/getDeterministicBonus';

/**
  * Returns the AC components of an actor
 * @param {*} actor
 * @returns {String}
 */
export default function getACComponents(actor) {
  const baseChanges = actor.system.attributes.ac.changes ?? {};
  if (!baseChanges?.override && !baseChanges?.bonuses?.length) return '';

  // Get ac base effects
  const effectChanges = actor.effects.reduce((acc, effect) => {
    const changes = effect.changes
      .reduce((changesAcc, change) => {
        if (change.key !== 'system.attributes.ac.changes.bonuses.value') return changesAcc;

        changesAcc.push({
          name: effect.name,
          mode: change.mode,
          value: getDeterministicBonus(change.value, actor.getRollData()) ?? 0
        });
        return changesAcc;
      }, []);

    return acc.concat(changes);
  }, []);

  let changes;
  if (effectChanges.find(({ mode }) => mode === CONST.ACTIVE_EFFECT_MODES.OVERRIDE)) {
    changes = effectChanges;
  } else changes = (baseChanges.bonuses.components ?? []).concat(effectChanges);

  const components = changes.map(({ name, value }) => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign} ${value} [${name}]`;
  });

  components.unshift(`${baseChanges.override.value} [${baseChanges.override.name}]`);
  return components.join(' ');
}
