/* eslint-disable no-param-reassign */
import getDeterministicBonus from '../dice/getDeterministicBonus';
import simplifyOperatorTerms from '../dice/simplifyOperatorTerms';

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
    if (effect.isSuppressed) return acc;

    const changes = effect.changes
      .reduce((changesAcc, change) => {
        if (change.key !== 'system.attributes.ac.changes.bonuses.value') return changesAcc;

        let value = 0;
        try {
          value = getDeterministicBonus(change.value, actor.getRollData());
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }

        changesAcc.push({
          name: effect.name,
          mode: change.mode,
          value
        });
        return changesAcc;
      }, []);

    return acc.concat(changes);
  }, []);

  /**
   * We don't need to worry about base ac overrides here because the property is changed by effects.
   */
  let changes;
  if (effectChanges.find(({ mode }) => mode === CONFIG.A5E.ACTIVE_EFFECT_MODES.OVERRIDE)) {
    changes = effectChanges;
  } else {
    changes = (baseChanges.bonuses.components ?? [])
      .concat(baseChanges.bonuses.value ? effectChanges : []);
  }

  const components = changes.map(({ name, value }) => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign} ${Math.abs(value)}[${name}]`;
  });

  // Add override component
  if (baseChanges.override.formula) {
    const formulaTerms = new Roll(baseChanges.override.formula, actor.getRollData())
      .evaluateSync().terms;

    const formula = simplifyOperatorTerms(formulaTerms ?? []).reduce((acc, term) => {
      if (term instanceof foundry.dice.terms.OperatorTerm) return `${acc} ${term.operator} `;
      acc += `${term.total}`;
      if (term.options?.flavor) {
        acc += `[${term.options.flavor.replaceAll('[', '(').replaceAll(']', ')')}]`;
      }
      return acc;
    }, '');

    components.unshift(formula);
  } else {
    components.unshift(
      `${baseChanges.override.value}[${baseChanges.override.name.replaceAll('[', '(').replaceAll(']', ')')}]`
    );
  }

  // Finalize the formula string
  const acFormula = simplifyOperatorTerms(
    new Roll(components.join(' '), actor.getRollData())
      .evaluateSync()
      .terms ?? []
  );

  return Roll.getFormula(acFormula);
}
