export default function prepareHealingBonuses(actor, item, rolls) {
  const bonusHealing = actor.system.bonuses.healing;
  const counts = {};
  const healingRolls = rolls.healing ?? [];
  const spellLevel = item.system.level ?? null;

  if (!healingRolls.length) return [];

  const heals = new Set(healingRolls.map(([, { healingType }]) => healingType));

  const healingBonuses = Object.entries(bonusHealing).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;

      const { spellLevels } = context;
      const healingTypes = new Set(context.healingTypes ?? []);

      if (healingTypes.size && !healingTypes.intersects(heals)) return false;
      if (spellLevel !== null && spellLevels.length && !spellLevels.includes(`${spellLevel}`)) return false;

      return true;
    }
  );

  return healingBonuses.map(([key, healingBonus]) => {
    const healingType = healingBonus.healingType || 'healing';

    if (!healingBonus.label) {
      const label = game.i18n.localize(CONFIG.A5E.healingTypes[healingType]);

      counts[healingType] ??= 0;
      counts[healingType] += 1;

      healingBonus.defaultLabel = `${label} #${counts[healingType]}`;
    }

    return [key, healingBonus];
  });
}
