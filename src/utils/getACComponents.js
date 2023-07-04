/**
  * Returns the AC components of an actor
 * @param {*} actor
 * @returns {String}
 */
export default function getACComponents(actor) {
  const { changes } = actor.system.attributes.ac;
  if (!changes.length) return '';

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
