import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';

import getSpellBookAbility from './getSpellBookAbility.ts';

/**
 * A utility function for determining the correct attribute to use for a given attack roll.
 */
export default function getAttackAbility(
	actor: Actor.OfType<'base'>,
	item: ItemA5e,
	attackData: AttackRollData | undefined | null,
): string {
	if (!attackData) return 'str';

	const actorData = actor.system;
	const itemData = item.system;

	const dexMod: number = actorData.abilities.dex.mod;
	const strMod: number = actorData.abilities.str.mod;

	if (Object.values(attackData).length) {
		attackData.attackType ??= 'meleeWeaponAttack';
	}

	if (attackData.ability === 'spellcasting') {
		//@ts-expect-error
		return getSpellBookAbility(actor, item);
	}

	if (attackData?.ability === 'default') {
		if (['meleeSpellAttack', 'rangedSpellAttack'].includes(attackData.attackType)) {
			//@ts-expect-error
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
