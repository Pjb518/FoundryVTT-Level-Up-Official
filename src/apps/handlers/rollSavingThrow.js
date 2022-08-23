import getRollModeFromEvent from '../utils/getRollModeFromEvent';

export default function rollSavingThrow(actor, abilityLabel, event) {
  const options = {};
  const rollMode = getRollModeFromEvent(event);

  if (rollMode) options.rollMode = rollMode;

  actor.rollSavingThrow(abilityLabel, options);
}
