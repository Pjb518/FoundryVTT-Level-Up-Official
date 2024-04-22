export default function prepareRollTooltipFormula(roll) {
  const terseRollFormulae = game.settings.get('a5e', 'terseRollFormulae');

  const terms = roll.terms.reduce((acc, term) => {
    let newTerm = `<span class="a5e-roll-formula__term">${term.expression}`;

    if (term.flavor && !terseRollFormulae) newTerm += ` [${term.flavor}]`;

    newTerm += '</span>';

    return acc + newTerm;
  }, '');

  return `<div class="a5e-roll-formula">${terms}</div>`;
}
