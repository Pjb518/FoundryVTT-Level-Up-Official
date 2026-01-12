import { prepareRollTooltipDiceResults } from "./prepareRollTooltipDiceResults.ts";

export function prepareRollTooltipRollParts(roll, rollData) {
  return roll.dice.reduce((acc, part) => {
    let newPart = `<section class="u-mb-md">
          <header class="a5e-dice-tooltip__header u-flex u-justify-space-between u-text-bold">
              <div class="a5e-dice-tooltip__formula">
                  ${part.expression}
                  <span class="a5e-dice-tooltip__flavor">`;

    if (part.flavor) newPart += ` [${part.flavor}]`;

    newPart += `</span></div>
              <span class="a5e-dice-tooltip__total">${part.total}</span>
          </header>

      <ol class="u-align-center u-flex u-flex-wrap u-gap-xs u-list-style-none u-my-xs u-p-0">`;

    newPart += prepareRollTooltipDiceResults(part, rollData);
    newPart += "</ol></section>";

    return acc + newPart;
  }, "");
}
