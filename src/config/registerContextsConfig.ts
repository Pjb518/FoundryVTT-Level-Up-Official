export default function registerContextsConfig() {
  const abilityBonusContexts = {
    base: 'A5E.contexts.base',
    check: 'A5E.contexts.check',
    save: 'A5E.contexts.save'
  };

  const damageBonusContexts = {
    meleeWeaponAttack: 'A5E.damageBonuses.contexts.meleeWeaponAttacks',
    meleeSpellAttack: 'A5E.damageBonuses.contexts.meleeSpellAttacks',
    rangedWeaponAttack: 'A5E.damageBonuses.contexts.rangedWeaponAttacks',
    rangedSpellAttack: 'A5E.damageBonuses.contexts.rangedSpellAttacks'
  };

  const damageBonusSummariesByContext = {
    all: 'A5E.damageBonuses.summaries.contexts.all',
    meleeWeaponAttack: 'A5E.damageBonuses.summaries.contexts.meleeWeaponAttacks',
    meleeSpellAttack: 'A5E.damageBonuses.summaries.contexts.meleeSpellAttacks',
    rangedWeaponAttack: 'A5E.damageBonuses.summaries.contexts.rangedWeaponAttacks',
    rangedSpellAttack: 'A5E.damageBonuses.summaries.contexts.rangedSpellAttacks',
    spellAttacks: 'A5E.damageBonuses.summaries.contexts.spellAttacks',
    weaponAttacks: 'A5E.damageBonuses.summaries.contexts.weaponAttacks'
  };

  const healingBonusContexts = {
    healing: 'A5E.healingBonuses.contexts.healing',
    temporaryHealing: 'A5E.healingBonuses.contexts.temporaryHealing'
  };

  const healingBonusSummariesByContext = {
    healing: 'A5E.healingBonuses.summaries.contexts.healing',
    temporaryHealing: 'A5E.healingBonuses.summaries.contexts.temporaryHealing'
  };

  const skillBonusContexts = {
    check: 'A5E.contexts.check',
    passive: 'A5E.contexts.passive'
  };

  return {
    abilityBonusContexts,
    damageBonusContexts,
    damageBonusSummariesByContext,
    healingBonusContexts,
    healingBonusSummariesByContext,
    skillBonusContexts
  };
}
