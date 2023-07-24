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

  /**
   * We don't need to worry about base ac overrides here because the property is changed by effects.
   */
  let changes;
  if (effectChanges.find(({ mode }) => mode === CONST.ACTIVE_EFFECT_MODES.OVERRIDE)) {
    changes = effectChanges;
  } else changes = (baseChanges.bonuses.components ?? []).concat(effectChanges);

  const components = changes.map(({ name, value }) => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign} ${value} [${name}]`;
  });

  // Add override component
  const formulaTerms = new Roll(baseChanges.override.formula, actor.getRollData())
    .evaluate({ async: false }).terms;
  const overrideComponents = [];
  formulaTerms.forEach((term) => {
    if (term instanceof OperatorTerm) return;
    if (term.options.flavor) overrideComponents.push(`${term.total} [${term.options.flavor}]`);
    else overrideComponents.push(`${term.total}`);
  });

  components.unshift(overrideComponents.join(' + '));
  return components.join(' ');
}
