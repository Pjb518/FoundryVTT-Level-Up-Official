export default function prepareHealingBonuses(actor, rolls) {
  const bonusHealing = actor.system.bonuses.healing;
  const counts = {};
  const healingRolls = rolls.healing ?? [];

  if (!healingRolls.length) return [];

  const hasHealing = healingRolls.some(([, { healingType }]) => healingType === 'healing' || !healingType);
  const hasTempHealing = healingRolls.some(([, { healingType }]) => healingType === 'temporaryHealing');

  const healingBonuses = Object.entries(bonusHealing).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;

      if (context === 'all') return true;

      if (hasHealing) return context === 'healing';
      if (hasTempHealing) return context === 'temporaryHealing';

      return false;
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
