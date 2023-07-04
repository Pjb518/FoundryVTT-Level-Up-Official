/**
  * Returns the AC components of an actor
 * @param {*} actor
 * @returns {String}
 */
export default function getACComponents(actor) {
  const baseChanges = actor.system.attributes.ac.changes;
  if (!baseChanges.length) return '';

  // Get ac base effects
  // const effectChanges = actor.effects.reduce((acc, effect) => {
  //   const changes = effect.data.changes
  //     .filter((change) => change.key === 'system.attributes.ac.value');
  //   return acc.concat(changes);
  // });

  const components = baseChanges
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
