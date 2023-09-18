import { localize } from '#runtime/svelte/helper';

export default function getActivationCostLabel(item, action) {
  if (foundry.utils.isEmpty(action)) return null;

  const { activation } = action;
  let activationLabel = '';

  if (foundry.utils.isEmpty(activation) || !activation.type) return null;

  if (activation.type === 'reaction') {
    if (activation.reactionTrigger) {
      activationLabel = `${localize('A5E.ActionActivationReaction')} (${activation.reactionTrigger})`;
    } else {
      activationLabel = localize('A5E.ActionActivationReaction');
    }
  } else if (activation.cost === 0 || activation.cost > 1) {
    activationLabel = `${activation.cost} ${CONFIG.A5E.abilityActivationTypesPlural[activation.type]}`;
  } else if (['none', 'special'].includes(activation.type)) {
    activationLabel = CONFIG.A5E.abilityActivationTypes[activation?.type];
  } else {
    activationLabel = `${activation.cost} ${CONFIG.A5E.abilityActivationTypes[activation.type]}`;
  }

  if (item?.system?.ritual) activationLabel += ' (Ritual)';

  return activationLabel;
}
