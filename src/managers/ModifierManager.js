import { localize } from '#runtime/util/i18n';

import getExpertiseDieSize from '../utils/getExpertiseDieSize';

export default class ModifierManager {
	constructor(actor, rollData) {
		this.actor = actor;
		this.rollData = rollData;
	}

	getModifiers() {
		switch (this.rollData.type) {
			case 'abilityCheck':
				return this.#getAbilityCheckModifiers().filter(Boolean);
			case 'attack':
				return this.#getAttackRollModifiers().filter(Boolean);
			case 'initiative':
				return this.#getInitiativeRollModifiers().filter(Boolean);
			case 'savingThrow':
				return this.#getSavingThrowModifiers().filter(Boolean);
			case 'skillCheck':
				return this.#getSkillCheckModifiers().filter(Boolean);
			default:
				return [];
		}
	}

	#getAbilityCheckModifiers() {
		return [
			this.#getAbilityModifier(),
			this.#getAbilityCheckProficiencyBonus(),
			this.#getAbilityCheckBonus(),
			this.#getExpertiseDice(),
			this.#getSituationalModifiers(),
		];
	}

	#getAttackRollModifiers() {
		return [
			this.#getProficiencyBonus(),
			this.#getAbilityModifier(),
			this.#getAttackBonus(),
			this.#getGlobalAttackBonus(),
			this.#getExpertiseDice(),
			this.#getSituationalModifiers(),
		];
	}

	#getInitiativeRollModifiers() {
		if (game.settings.storage.get('world').getItem('a5e.simpleInitiative') ?? false) {
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
			this.#getExpertiseDice(),
			this.#getSituationalModifiers(),
		];
	}

	#getSkillCheckModifiers() {
		return [
			this.#getSkillCheckModifier(),
			this.#getAbilityModifier(),
			this.#getSkillCheckBonus(),
			this.#getAbilityCheckBonus(),
			this.#getExpertiseDice(),
			this.#getSituationalModifiers(),
		];
	}

	#getAbilityCheckBonus() {
		const { ability, selectedAbilityBonuses } = this.rollData;
		if (!ability) return null;

		let value;
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
			value: value || null,
		};
	}

	#getAbilityModifier() {
		const { ability } = this.rollData;

		if (!ability) return null;

		return {
			label: localize('A5E.abilities.headings.checkMod', {
				ability: CONFIG.A5E.abilities[ability] ?? ability,
			}),
			value: this.actor.system.abilities[ability]?.mod ?? null,
		};
	}

	#getAbilityCheckProficiencyBonus() {
		const { ability } = this.rollData;

		if (!ability) return null;

		let jackOfAllTrades = false;
		if (game.settings.storage.get('world').getItem('a5e.5eStyleJackOfAllTrades') ?? false) {
			jackOfAllTrades = this.actor.flags.a5e?.jackOfAllTrades ?? false;
		}

		if (!jackOfAllTrades) return null;

		return {
			label: localize('A5E.proficiency.jack'),
			value: Math.floor(this.actor.system.attributes.prof / 2),
		};
	}

	#getAbilitySaveBonus() {
		const { ability, selectedAbilityBonuses } = this.rollData;
		if (!ability) return null;

		let value;
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
			value: value || null,
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
			label: localize('A5E.attacks.headings.bonus'),
			value: this.rollData.attackBonus ?? 0,
		};
	}

	#getConcentrationBonus() {
		if (this.rollData.saveType !== 'concentration') return null;

		return {
			label: localize('A5E.bonuses.labels.concentration.defaultName'),
			value: this.actor.system.abilities.con.save.concentrationBonus,
		};
	}

	#getExpertiseDice() {
		return {
			label: localize('A5E.expertiseDie.title'),
			value: getExpertiseDieSize(this.rollData?.expertiseDie ?? 0),
		};
	}

	#getGlobalAttackBonus() {
		const { BonusesManager } = this.actor;
		const { attackType, item, selectedAttackBonuses } = this.rollData;

		let value;

		if (selectedAttackBonuses) {
			value = BonusesManager.getSelectedBonusesFormula('attacks', selectedAttackBonuses);
		} else {
			value = BonusesManager.getAttackBonusFormula(item, attackType);
		}

		switch (attackType) {
			case 'meleeSpellAttack':
				return { label: localize('A5E.bonuses.labels.attack.meleeSpellAttack'), value };
			case 'meleeWeaponAttack':
				return { label: localize('A5E.bonuses.labels.attack.meleeWeaponAttack'), value };
			case 'rangedSpellAttack':
				return { label: localize('A5E.bonuses.labels.attack.rangedSpellAttack'), value };
			case 'rangedWeaponAttack':
				return { label: localize('A5E.bonuses.labels.attack.rangedWeaponAttack'), value };
			default:
				return null;
		}
	}

	#getInitiativeBonus() {
		const { ability, selectedInitiativeBonuses, skill } = this.rollData;

		let value;
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
			label: localize('A5E.initiative.bonus'),
			value: value || null,
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

		if (skill?.proficient === 2) labelKey = 'A5E.proficiency.bonusExpertise';
		else if (skill?.proficient) labelKey = 'A5E.proficiency.bonus';
		else if (jackOfAllTrades) labelKey = 'A5E.proficiency.jack';

		return {
			label: labelKey ? localize(labelKey, { skill: CONFIG.A5E.skills[skillKey] }) : '',
			value: skill?.mod ?? null,
		};
	}

	#getSkillCheckBonus() {
		const { ability, selectedSkillBonuses, skill } = this.rollData;
		if (!skill) return null;

		let value;
		if (selectedSkillBonuses) {
			value = this.actor.BonusesManager.getSelectedBonusesFormula('skills', selectedSkillBonuses);
		} else {
			value = this.actor.BonusesManager.getSkillBonusesFormula(skill, ability);
		}

		return {
			label: localize('A5E.SkillCheckBonus', { skill: CONFIG.A5E.skills[skill] }),
			value: value || null,
		};
	}

	#getSituationalModifiers() {
		return { value: this.rollData.situationalMods };
	}
}
