export default function migrateActorBonuses(actorData, updateData) {
  const old = actorData?.system?.bonuses?.spell;

  updateData['system.bonuses'] = {
    meleeSpellAttack: old?.attack ?? '',
    rangedSpellAttack: old?.attack ?? '',
    spellDC: old?.dc ?? ''
  };

  updateData['system.bonuses.-=spell'] = null;

  return updateData;
}
