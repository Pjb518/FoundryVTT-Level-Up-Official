export default function prepareDamageBonuses(actor, item, rolls) {
  console.log(rolls);
  const attackRoll = rolls.attack ?? [];
  const damageRolls = rolls.damage ?? [];
  const spellLevel = item.system.level ?? null;

  if (!Array.isArray(attackRoll[0])) return [];

  const { attackType } = attackRoll[0][1] ?? {};
  const damages = new Set(damageRolls.map(([, { damageType }]) => damageType));
  const bonusDamage = actor.system.bonuses.damage;
  const counts = {};

  const damageBonuses = Object.entries(bonusDamage).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;
      const { attackTypes, spellLevels } = context;
      const damageTypes = new Set(context.damageTypes ?? []);

      if (attackTypes && !attackTypes.includes(attackType)) return false;
      if (spellLevel !== null && !spellLevels.includes(`${spellLevel}`)) return false;
      if (!damageTypes.intersects(damages)) return false;

      return true;
    }
  );

  return damageBonuses.map(([key, damageBonus]) => {
    if (!damageBonus.label) {
      const label = game.i18n.format('A5E.DamageBonusSpecific', {
        damageType: game.i18n.localize(CONFIG.A5E.damageTypes[damageBonus.damageType] ?? '')
      });

      counts[damageBonus.damageType] ??= 0;
      counts[damageBonus.damageType] += 1;

      damageBonus.defaultLabel = `${label} #${counts[damageBonus.damageType]}`;
    }

    return [key, damageBonus];
  });
}
