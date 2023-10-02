import { localize } from '#runtime/svelte/helper';

export default function getTargetLabel(action) {
  const target = action?.target;

  if (foundry.utils.isEmpty(target) || !target.type || target.type === 'none') return null;

  if (target?.type === 'self') return localize('A5E.TargetSelf');
  if (target?.type === 'other') return localize('A5E.TargetOther');

  if (target?.quantity === 0 || target?.quantity > 1) {
    return `${target.quantity} ${CONFIG.A5E.targetTypesPlural[target.type]}`;
  }

  return `${target?.quantity || 1} ${CONFIG.A5E.targetTypes[target?.type]}`;
}
