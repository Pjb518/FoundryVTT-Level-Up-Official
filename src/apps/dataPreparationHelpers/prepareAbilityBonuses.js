export default function prepareAbilityBonuses(actor, abilityKey, type) {
  const bonuses = actor.system.bonuses.abilities;
  const ability = actor.system.abilities[abilityKey];

  if (!ability) return [];

  const abilityBonuses = Object.entries(bonuses).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;
      const { abilities, requiresProficiency, types } = context;
      if (!abilities.includes(abilityKey)) return false;

      // Remove passive bonuses
      if (!types.includes(type)) return false;
      if (requiresProficiency && !ability[type].proficient) return false;

      return true;
    }
  );

  const counts = {};

  return abilityBonuses.map(([key, abilityBonus]) => {
    if (!abilityBonus.label) {
      const label = game.i18n.format('A5E.AbilityBonusSpecific', {
        skill: game.i18n.localize(CONFIG.A5E.abilities[abilityKey] ?? '')
      });

      counts[abilityKey] ??= 0;
      counts[abilityKey] += 1;

      abilityBonus.defaultLabel = `${label} #${counts[abilityKey]}`;
    }

    return [key, abilityBonus];
  });
}
