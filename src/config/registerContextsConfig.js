export default function registerContextsConfig(A5E) {
  A5E.damageBonusContexts = {
    meleeWeaponAttacks: 'A5E.damageBonuses.contexts.meleeWeaponAttacks',
    meleeSpellAttacks: 'A5E.damageBonuses.contexts.meleeSpellAttacks',
    rangedWeaponAttacks: 'A5E.damageBonuses.contexts.rangedWeaponAttacks',
    rangedSpellAttacks: 'A5E.damageBonuses.contexts.rangedSpellAttacks'
  };

  A5E.damageBonusSummariesByContext = {
    all: 'A5E.damageBonuses.summaries.contexts.all',
    meleeWeaponAttacks: 'A5E.damageBonuses.summaries.contexts.meleeWeaponAttacks',
    meleeSpellAttacks: 'A5E.damageBonuses.summaries.contexts.meleeSpellAttacks',
    rangedWeaponAttacks: 'A5E.damageBonuses.summaries.contexts.rangedWeaponAttacks',
    rangedSpellAttacks: 'A5E.damageBonuses.summaries.contexts.rangedSpellAttacks',
    spellAttacks: 'A5E.damageBonuses.summaries.contexts.spellAttacks',
    weaponAttacks: 'A5E.damageBonuses.summaries.contexts.weaponAttacks'
  };
}
