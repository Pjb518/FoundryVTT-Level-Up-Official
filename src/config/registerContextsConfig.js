export default function registerContextsConfig(A5E) {
  A5E.abilityBonusContexts = {
    base: 'A5E.contexts.base',
    check: 'A5E.contexts.check',
    save: 'A5E.contexts.save'
  };

  A5E.damageBonusContexts = {
    meleeWeaponAttack: 'A5E.damageBonuses.contexts.meleeWeaponAttacks',
    meleeSpellAttack: 'A5E.damageBonuses.contexts.meleeSpellAttacks',
    rangedWeaponAttack: 'A5E.damageBonuses.contexts.rangedWeaponAttacks',
    rangedSpellAttack: 'A5E.damageBonuses.contexts.rangedSpellAttacks'
  };

  A5E.damageBonusSummariesByContext = {
    all: 'A5E.damageBonuses.summaries.contexts.all',
    meleeWeaponAttack: 'A5E.damageBonuses.summaries.contexts.meleeWeaponAttacks',
    meleeSpellAttack: 'A5E.damageBonuses.summaries.contexts.meleeSpellAttacks',
    rangedWeaponAttack: 'A5E.damageBonuses.summaries.contexts.rangedWeaponAttacks',
    rangedSpellAttack: 'A5E.damageBonuses.summaries.contexts.rangedSpellAttacks',
    spellAttacks: 'A5E.damageBonuses.summaries.contexts.spellAttacks',
    weaponAttacks: 'A5E.damageBonuses.summaries.contexts.weaponAttacks'
  };

  A5E.healingBonusContexts = {
    healing: 'A5E.healingBonuses.contexts.healing',
    temporaryHealing: 'A5E.healingBonuses.contexts.temporaryHealing'
  };

  A5E.healingBonusSummariesByContext = {
    healing: 'A5E.healingBonuses.summaries.contexts.healing',
    temporaryHealing: 'A5E.healingBonuses.summaries.contexts.temporaryHealing'
  };

  A5E.skillBonusContexts = {
    check: 'A5E.contexts.check',
    passive: 'A5E.contexts.passive'
  };
}
