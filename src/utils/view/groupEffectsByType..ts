export function groupEffectsByType(effects: ActiveEffect[]) {
  const categories = {
    conditions: [] as ActiveEffect[],
    ongoing: [] as ActiveEffect[],
    inactive: [] as ActiveEffect[],
  };

  effects.forEach((effect) => {
    if (effect.isSuppressed) categories.inactive.push(effect);
    else categories.ongoing.push(effect);
  });

  return categories;
}
