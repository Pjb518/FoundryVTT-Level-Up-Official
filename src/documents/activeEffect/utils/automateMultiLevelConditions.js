export default async function automateMultiLevelConditions(actor, data, userId) {
  if (game.user.id !== userId) return;
  const conditionKeys = new Set(['fatigue', 'exhaustion', 'strife']);
  const keys = new Set(Object.keys(data?.system?.attributes ?? {}));

  const applicableConditions = conditionKeys.intersection(keys);
  if (!applicableConditions?.size) return;

  applicableConditions.forEach(async (property) => {
    const value = data.system.attributes[property];
    const effect = CONFIG.statusEffects.find((e) => e.id === property);

    if (!effect) return;

    const changeKey = property === 'fatigue' && game.settings.get('a5e', 'replaceFatigueAndStrife')
      ? 'exhaustion'
      : property;

    const changes = Object.entries(CONFIG.A5E.multiLevelConditions[changeKey] ?? {})
      .reduce((arr, [level, c]) => {
        if (level > value) return arr;
        arr.push(...c);
        return arr;
      }, []);

    const existing = actor.effects.get(effect._id);
    if (existing) await existing.delete();

    if (value === 0) return;

    const newEffect = await ActiveEffect.implementation.fromStatusEffect(effect.id);
    newEffect.updateSource({ changes });
    await ActiveEffect.implementation.create(newEffect, { parent: actor, keepId: true });
  });
}
