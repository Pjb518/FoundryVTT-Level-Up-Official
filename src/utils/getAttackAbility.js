export default function getAttackAbility(actor, item, attackData) {
  const actorData = actor.system;
  const itemData = item.system;

  const dexMod = actorData.abilities.dex.mod;
  const strMod = actorData.abilities.str.mod;

  if (attackData.ability === 'spellcasting') {
    return actorData.attributes.spellcasting ?? 'int';
  }

  if (attackData?.ability === 'default') {
    if (['meleeSpellAttack', 'rangedSpellAttack'].includes(attackData.attackType)) {
      return actorData.attributes.spellcasting ?? 'int';
    }

    if (attackData.attackType === 'meleeWeaponAttack') {
      if (itemData?.weaponProperties?.includes('finesse')) {
        return dexMod > strMod ? 'dex' : 'str';
      }

      return 'str';
    }

    if (attackData.attackType === 'rangedWeaponAttack') {
      if (itemData?.weaponProperties?.includes('thrown')) {
        return dexMod > strMod ? 'dex' : 'str';
      }

      return 'dex';
    }
  }

  return attackData.ability;
}
