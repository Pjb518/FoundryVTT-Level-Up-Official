export default function registerContextsConfig(A5E) {
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
}
