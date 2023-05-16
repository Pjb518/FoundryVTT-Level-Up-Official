// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
import getExpertiseDieSize from '../utils/getExpertiseDieSize';

export default class ModifierManager {
  constructor(actor, rollData) {
    this.actor = actor;
    this.rollData = rollData;
  }

  getModifiers() {
    switch (this.rollData.type) {
      case 'attack':
        return this.#getAttackRollModifiers().filter(Boolean);
      default:
        return [];
    }
  }

  #getAttackRollModifiers() {
    return [
      this.#getProficiencyBonus(),
      this.#getAbilityModifier(),
      this.#getAttackBonus(),
      this.#getGlobalAttackBonus(),
      this.#getExpertiseDice(),
      this.#getSituationalMods()
    ];
  }

  #getAbilityModifier() {
    const { ability } = this.rollData;

    if (!this.rollData.ability) return null;

    return {
      label: localize('A5E.AbilityCheckMod', {
        ability: localize(CONFIG.A5E.abilities[ability] ?? ability)
      }),
      value: this.actor.system.abilities[ability].mod
    };
  }

  #getAttackBonus() {
    return {
      label: localize('A5E.AttackBonus'),
      value: this.rollData.attackBonus ?? 0
    };
  }

  #getExpertiseDice() {
    return {
      label: localize('A5E.ExpertiseDie'),
      value: getExpertiseDieSize(this.rollData?.expertiseDie ?? 0)
    };
  }

  #getGlobalAttackBonus() {
    const { bonuses } = this.actor.system;

    switch (this.rollData.attackType) {
      case 'meleeSpellAttack':
        return {
          label: localize('A5E.BonusMeleeSpellAttack'),
          value: bonuses.meleeSpellAttack
        };
      case 'meleeWeaponAttack':
        return {
          label: localize('A5E.BonusMeleeWeaponAttack'),
          value: bonuses.meleeWeaponAttack
        };
      case 'rangedSpellAttack':
        return {
          label: localize('A5E.BonusRangedSpellAttack'),
          value: bonuses.rangedSpellAttack
        };
      case 'rangedWeaponAttack':
        return {
          label: localize('A5E.BonusRangedWeaponAttack'),
          value: bonuses.rangedWeaponAttack
        };
      default:
        return null;
    }
  }

  #getProficiencyBonus() {
    if (!this.rollData.proficient) return null;

    return {
      label: localize('A5E.ProficiencyBonusAbbr'),
      value: this.actor.system.attributes.prof
    };
  }

  #getSituationalMods() {
    return { value: this.rollData.situationalMods };
  }
}
