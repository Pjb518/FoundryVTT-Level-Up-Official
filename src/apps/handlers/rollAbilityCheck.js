import getRollModeFromEvent from "../utils/getRollModeFromEvent";

export default function rollAbilityCheck(actor, abilityLabel, event) {
  const options = {};
  const rollMode = getRollModeFromEvent(event);

  if (rollMode) options.rollMode = rollMode;

  actor.rollSavingThrow(abilityLabel, options);
}
