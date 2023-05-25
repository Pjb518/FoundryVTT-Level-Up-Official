export default function prepareDamageBonuses(actor, attackRoll) {
  if (!attackRoll || !Array.isArray(attackRoll)) return [];

  const { attackType } = attackRoll[1] ?? {};
  const bonusDamage = actor.system.bonuses.damage;
  const counts = {};

  const damageBonuses = Object.entries(bonusDamage).filter(
    ([, { context, formula }]) => {
      if (!formula) return false;

      if (context === 'all') return true;

      if (attackType === 'meleeWeaponAttack') {
        return ['meleeWeaponAttacks', 'weaponAttacks'].includes(context);
      }

      if (attackType === 'rangedWeaponAttack') {
        return ['rangedWeaponAttacks', 'weaponAttacks'].includes(context);
      }

      if (attackType === 'meleeSpellAttack') {
        return ['meleeSpellAttacks', 'spellAttacks'].includes(context);
      }

      if (attackType === 'rangedSpellAttack') {
        return ['rangedSpellAttacks', 'spellAttacks'].includes(context);
      }

      return false;
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
