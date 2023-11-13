export default function getActionScalingModes(action: Action): string[] {
  const scalableRolls = Object.values(action.rolls ?? {})
    .filter((r: BaseRoll) => ['damage', 'healing'].includes(r.type));

  const scalingModes: string[] = scalableRolls.reduce((acc, r: DamageRoll | HealingRoll) => {
    if (r.scaling?.mode) acc.push(r.scaling?.mode);
    return acc;
  }, []);

  if (action.target?.scaling?.mode) scalingModes.push(action.target?.scaling?.mode);
  if (action.area?.scaling?.mode) scalingModes.push(action.area?.scaling?.mode);

  return scalingModes;
}
