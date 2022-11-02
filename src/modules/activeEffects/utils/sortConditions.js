// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Sort Conditions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function sortConditions(wrapped, ...args) {
  CONFIG.statusEffects = CONFIG.statusEffects.sort((a, b) => {
    const aid = (a.label !== undefined ? game.i18n.localize(a.label) : a.id || a);
    const bid = (b.label !== undefined ? game.i18n.localize(b.label) : b.id || b);
    // eslint-disable-next-line no-nested-ternary
    return (aid > bid ? 1 : (aid < bid ? -1 : 0));
  });

  return wrapped(...args);
}
