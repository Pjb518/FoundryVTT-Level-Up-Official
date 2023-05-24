import type Action from 'types/action';

export default function showActivationDialogSection(
  action: Action,
  consumerTypes = [],
  scalingModes = []
) {
  const hasConsumer = Object.values(action.consumers ?? {})
    .filter((c) => consumerTypes.includes(c.type)).length > 0;

  const hasDamageScaling = Object.values(action.rolls ?? {})
    ?.filter((r: DamageRoll | HealingRoll) => ['damage', 'healing'].includes(r.type))
    .some((dr: DamageRoll | HealingRoll) => scalingModes.includes(dr.scaling?.mode));
  const hasTargetScaling = scalingModes.includes(
    action.target?.scaling?.mode
  );
  const hasTemplateScaling = scalingModes.includes(
    action.area?.scaling?.mode
  );

  return (
    hasConsumer
    || hasDamageScaling
    || hasTargetScaling
    || hasTemplateScaling
  );
}
