import type { ItemA5e } from '#documents/item/item.ts';
import { localize } from '#utils/localization/localize.ts';

class ModifierManager {
	actor: Actor.OfType<'base'>;

	rollData: ModifierManager.RollData;

	constructor(actor: Actor.OfType<'base'>, rollData: ModifierManager.RollData) {
		this.actor = actor;
		this.rollData = rollData;
	}

	getModifiers(): { label?: string; value: string | number }[] {
		switch (this.rollData.type) {
			case 'abilityCheck':
				return this.#getAbilityCheckModifiers().filter((m) => !!m);
			case 'attack':
				return this.#getAttackRollModifiers().filter((m) => !!m);
			case 'initiative':
				return this.#getInitiativeRollModifiers().filter((m) => !!m);
			case 'savingThrow':
				return this.#getSavingThrowModifiers().filter((m) => !!m);
			case 'skillCheck':
				return this.#getSkillCheckModifiers().filter((m) => !!m);
			default:
				return [];
		}
	}

	#getAbilityCheckModifiers() {
		return [
			this.#getAbilityModifier(),
			this.#getAbilityCheckProficiencyBonus(),
			this.#getAbilityCheckBonus(),
			this.#getSituationalModifiers(),
		];
	}

	#getAttackRollModifiers() {
		return [
			this.#getProficiencyBonus(),
			this.#getAbilityModifier(),
			this.#getAttackBonus(),
			this.#getGlobalAttackBonus(),
			this.#getSituationalModifiers(),
		];
	}

	#getInitiativeRollModifiers() {
		if (game.settings.storage.get('world')?.getItem('a5e.simpleInitiative') ?? false) {
			return [this.#getInitiativeBonus(), ...this.#getAbilityCheckModifiers()];
		}

		return [this.#getInitiativeBonus(), ...this.#getSkillCheckModifiers()];
	}

	#getSavingThrowModifiers() {
		return [
			this.#getAbilitySaveModifier(),
			this.#getAbilityModifier(),
			this.#getAbilitySaveBonus(),
			this.#getConcentrationBonus(),
			this.#getSituationalModifiers(),
		];
	}

	#getSkillCheckModifiers() {
		return [
			this.#getSkillCheckModifier(),
			this.#getAbilityModifier(),
			this.#getSkillCheckBonus(),
			this.#getAbilityCheckBonus(),
			this.#getSituationalModifiers(),
		];
	}

	#getAbilityCheckBonus() {
		const { ability, selectedAbilityBonuses } = this.rollData;
		if (!ability) return null;

		let value: string;
		if (selectedAbilityBonuses) {
			value = this.actor.BonusesManager.getSelectedBonusesFormula(
				'abilities',
				selectedAbilityBonuses,
			);
		} else {
			value = this.actor.BonusesManager.getAbilityBonusesFormula(ability, 'check');
		}

		return {
			label: localize('A5E.abilities.headings.checkBonus', {
				ability: CONFIG.A5E.abilities[ability],
			}),
			value: value || 0,
		};
	}

	#getAbilityModifier() {
		const { ability } = this.rollData;

		if (!ability) return null;

		return {
			label: localize('A5E.abilities.headings.checkMod', {
				ability: CONFIG.A5E.abilities[ability] ?? ability,
			}),
			value: (this.actor.system.abilities[ability]?.mod as number) ?? 0,
		};
	}

	#getAbilityCheckProficiencyBonus() {
		const { ability } = this.rollData;

		if (!ability) return null;

		let jackOfAllTrades = false;
		if (game.settings.storage.get('world')?.getItem('a5e.5eStyleJackOfAllTrades') ?? false) {
			jackOfAllTrades = this.actor.flags.a5e?.jackOfAllTrades ?? false;
		}

		if (!jackOfAllTrades) return null;

		return {
			label: localize('A5E.ProficiencyBonusJack'),
			value: Math.floor(this.actor.system.attributes.prof / 2),
		};
	}

	#getAbilitySaveBonus() {
		const { ability, selectedAbilityBonuses } = this.rollData;
		if (!ability) return null;

		let value: string;
		if (selectedAbilityBonuses) {
			value = this.actor.BonusesManager.getSelectedBonusesFormula(
				'abilities',
				selectedAbilityBonuses,
			);
		} else {
			value = this.actor.BonusesManager.getAbilityBonusesFormula(ability, 'save');
		}

		return {
			label: localize('A5E.abilities.headings.saveBonus', {
				ability: CONFIG.A5E.abilities[ability],
			}),
			value: value || 0,
		};
	}

	#getAbilitySaveModifier() {
		const { ability } = this.rollData;

		if (!ability) return null;

		const proficient = this.actor.system.abilities[ability]?.save?.proficient;
		const proficiencyBonus = this.actor.system.attributes.prof;

		return {
			label: localize('A5E.proficiency.bonus'),
			value: proficient ? proficiencyBonus : 0,
		};
	}

	#getAttackBonus() {
		return {
			label: localize('A5E.AttackBonus'),
			value: this.rollData.attackBonus ?? 0,
		};
	}

	#getConcentrationBonus() {
		if (this.rollData.saveType !== 'concentration') return null;

		return {
			label: localize('A5E.ConcentrationBonus'),
			// @ts-expect-error
			value: this.actor.system.abilities.con.save.concentrationBonus as string,
		};
	}

	#getGlobalAttackBonus() {
		const { BonusesManager } = this.actor;
		const { attackType, item, selectedAttackBonuses } = this.rollData;
		if (!item) return null;

		let value: string;

		if (selectedAttackBonuses) {
			value = BonusesManager.getSelectedBonusesFormula('attacks', selectedAttackBonuses);
		} else {
			value = BonusesManager.getAttackBonusFormula(item, attackType);
		}

		switch (attackType) {
			case 'meleeSpellAttack':
				return { label: localize('A5E.BonusMeleeSpellAttack'), value };
			case 'meleeWeaponAttack':
				return { label: localize('A5E.BonusMeleeWeaponAttack'), value };
			case 'rangedSpellAttack':
				return { label: localize('A5E.BonusRangedSpellAttack'), value };
			case 'rangedWeaponAttack':
				return { label: localize('A5E.BonusRangedWeaponAttack'), value };
			default:
				return null;
		}
	}

	#getInitiativeBonus() {
		const { ability, selectedInitiativeBonuses, skill } = this.rollData;

		let value: string;
		if (selectedInitiativeBonuses) {
			value = this.actor.BonusesManager.getSelectedBonusesFormula(
				'initiative',
				selectedInitiativeBonuses,
			);
		} else {
			value = this.actor.BonusesManager.getInitiativeBonusFormula({
				abilityKey: ability,
				skillKey: skill,
			});
		}

		return {
			label: localize('A5E.InitiativeBonus'),
			value: value || 0,
		};
	}

	#getProficiencyBonus() {
		if (!this.rollData.proficient) return null;

		return {
			label: localize('A5E.proficiency.bonus'),
			value: this.actor.system.attributes.prof,
		};
	}

	#getSkillCheckModifier() {
		const { skill: skillKey } = this.rollData;

		if (!skillKey) return null;

		let labelKey = 'A5E.SkillCheckMod';
		const jackOfAllTrades = this.actor.flags.a5e?.jackOfAllTrades;
		const skill = this.actor.system.skills[skillKey];

		if (skill?.proficient === 2) labelKey = 'A5E.ProficiencyBonusExpertise';
		else if (skill?.proficient) labelKey = 'A5E.proficiency.bonus';
		else if (jackOfAllTrades) labelKey = 'A5E.ProficiencyBonusJack';

		return {
			label: labelKey ? localize(labelKey, { skill: CONFIG.A5E.skills[skillKey] }) : '',
			value: (skill?.mod as number) ?? 0,
		};
	}

	#getSkillCheckBonus() {
		const { ability, selectedSkillBonuses, skill } = this.rollData;
		if (!skill) return null;

		let value: string;
		if (selectedSkillBonuses) {
			value = this.actor.BonusesManager.getSelectedBonusesFormula('skills', selectedSkillBonuses);
		} else {
			value = this.actor.BonusesManager.getSkillBonusesFormula(skill, ability);
		}

		return {
			label: localize('A5E.SkillCheckBonus', {
				skill: CONFIG.A5E.skills[skill],
			}),
			value: value || 0,
		};
	}

	#getSituationalModifiers() {
		return { value: this.rollData.situationalMods || 0 };
	}
}

declare namespace ModifierManager {
	type RollData = {
		ability?: string;
		attackBonus?: string | number;
		attackType?:
			| 'meleeSpellAttack'
			| 'meleeWeaponAttack'
			| 'rangedSpellAttack'
			| 'rangedWeaponAttack';
		item?: ItemA5e;
		expertiseDie?: number;
		minRoll?: number;
		maxRoll?: number;
		proficient?: number;
		rollMode?: number;
		saveType?: 'ability' | 'concentration' | 'death';
		selectedAbilityBonuses?: string[];
		selectedAttackBonuses?: string[];
		selectedInitiativeBonuses?: string[];
		selectedSkillBonuses?: string[];
		situationalMods?: string;
		skill?: string;
		type: 'abilityCheck' | 'attack' | 'initiative' | 'savingThrow' | 'skillCheck';
	};
}

export { ModifierManager };
