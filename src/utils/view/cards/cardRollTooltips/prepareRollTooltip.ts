import { getTooltipPermissions } from "./getTooltipPermissions.ts";
import { prepareRollTooltipFormula } from "./prepareRollTooltipFormula.ts";
import { prepareRollTooltipRollParts } from "./prepareRollTooltipParts.ts";

export default function prepareRollTooltip(message, roll, rollData) {
  if (!getTooltipPermissions(message)) return null;

  return [
    prepareRollTooltipRollParts(roll, rollData),
    prepareRollTooltipFormula(roll),
  ].join("");
}
