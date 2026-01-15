import { prepareRollTooltipDiceResults } from "./prepareRollTooltipDiceResults.ts";

export function prepareRollTooltipRollParts(roll, rollData) {
  return roll.dice.reduce((acc, part) => {
    let newPart = `<section class="u-mb-md">
          <header class="a5e-dice-tooltip__header">
              <div class="a5e-dice-tooltip__formula">
                  ${part.expression}
                  <span class="a5e-dice-tooltip__flavor">`;

    if (part.flavor) newPart += ` [${part.flavor}]`;

    newPart += `</span></div>
              <span class="a5e-dice-tooltip__total">${part.total}</span>
          </header>

      <ol class="a5e-dice-tooltip__results">`;

    newPart += prepareRollTooltipDiceResults(part, rollData);
    newPart += "</ol></section>";

    return acc + newPart;
  }, "");
}
