export default function getActionScalingModes(action: Action): Set<string> {
  const scalableRolls = Object.values(action.rolls ?? {})
    .filter((r: BaseRoll) => ['damage', 'healing'].includes(r.type));

  const scalingModes: Set<string> = scalableRolls.reduce((acc, r: DamageRoll | HealingRoll) => {
    if (r.scaling?.mode) acc.add(r.scaling?.mode);
    return acc;
  }, new Set<string>());

  if (action.target?.scaling?.mode) scalingModes.add(action.target?.scaling?.mode);
  if (action.area?.scaling?.mode) scalingModes.add(action.area?.scaling?.mode);

  return scalingModes;
}
