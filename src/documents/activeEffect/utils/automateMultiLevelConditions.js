export default async function automateMultiLevelConditions(actor, data, userId) {
  if (game.user.id !== userId) return;
  const conditionKeys = new Set(['fatigue', 'exhaustion', 'strife']);
  const keys = new Set(Object.keys(data?.system?.attributes ?? {}));

  const applicableConditions = conditionKeys.intersection(keys);
  if (!applicableConditions?.size) return;

  applicableConditions.forEach((property) => {
    const value = data.system.attributes[property];
    const tokens = actor.getActiveTokens();
    const effect = CONFIG.statusEffects.find((e) => e.id === property);

    if (!tokens?.length || !effect) return;

    const changes = Object.entries(CONFIG.A5E.multiLevelConditions[effect.id] ?? {})
      .reduce((arr, [level, c]) => {
        if (level > value) return arr;
        arr.push(...c);
        return arr;
      }, []);

    tokens.forEach((token) => {
      const newEffect = foundry.utils.deepClone(effect);
      newEffect.changes = changes;

      token.toggleEffect(effect, { active: false });

      if (value === 0) return;
      token.toggleEffect(newEffect, { active: true });
    });
  });
}
