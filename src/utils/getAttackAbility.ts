import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel';

import getSpellBookAbility from './getSpellBookAbility';

/**
 * A utility function for determining the correct attribute to use for a given attack roll.
 */
export default function getAttackAbility(
	actor: any,
	item: any,
	attackData: AttackRollData,
): string {
	const actorData: any = actor.system;
	const itemData: any = item.system;

	const dexMod: number = actorData.abilities.dex.mod;
	const strMod: number = actorData.abilities.str.mod;

	if (Object.values(attackData).length) {
		attackData.attackType ??= 'meleeWeaponAttack';
	}

	if (attackData.ability === 'spellcasting') {
		return getSpellBookAbility(actor, item);
	}

	if (attackData?.ability === 'default') {
		if (['meleeSpellAttack', 'rangedSpellAttack'].includes(attackData.attackType)) {
			return getSpellBookAbility(actor, item);
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
