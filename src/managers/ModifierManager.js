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
      this.#getAbilityCheckBonus(),
      this.#getGlobalAbilityCheckBonus(),
      this.#getExpertiseDice(),
      this.#getSituationalModifiers()
    ];
  }

  #getAttackRollModifiers() {
    return [
      this.#getProficiencyBonus(),
      this.#getAbilityModifier(),
      this.#getAttackBonus(),
      this.#getGlobalAttackBonus(),
      this.#getExpertiseDice(),
      this.#getSituationalModifiers()
    ];
  }

  #getInitiativeRollModifiers() {
    return [
      this.#getInitiativeBonus(),
      ...this.#getSkillCheckModifiers()
    ];
  }

  #getSavingThrowModifiers() {
    return [
      this.#getProficiencyBonus(),
      this.#getAbilitySaveModifier(),
      this.#getConcentrationBonus(),
      this.#getGlobalSavingThrowBonus(),
      this.#getExpertiseDice(),
      this.#getSituationalModifiers()
    ];
  }

  #getSkillCheckModifiers() {
    return [
      this.#getSkillCheckModifier(),
      this.#getAbilityModifier(),
      this.#getSkillCheckBonus(),
      this.#getAbilityCheckBonus(),
      this.#getGlobalSkillCheckBonus(),
      this.#getGlobalAbilityCheckBonus(),
      this.#getExpertiseDice(),
      this.#getSituationalModifiers()
    ];
  }

  #getAbilityCheckBonus() {
    const { ability } = this.rollData;

    if (!ability) return null;

    return {
      label: localize('A5E.AbilityCheckBonus', {
        ability: localize(CONFIG.A5E.abilities[ability])
      }),
      value: this.actor.system.abilities[ability]?.check.bonus ?? null
    };
  }

  #getAbilityModifier() {
    const { ability } = this.rollData;

    if (!ability) return null;

    return {
      label: localize('A5E.AbilityCheckMod', {
        ability: localize(CONFIG.A5E.abilities[ability] ?? ability)
      }),
      value: this.actor.system.abilities[ability]?.mod ?? null
    };
  }

  #getAbilitySaveModifier() {
    const { ability } = this.rollData;

    if (!ability) return null;

    return {
      label: localize('A5E.AbilityCheckMod', {
        ability: localize(CONFIG.A5E.abilities[ability] ?? ability)
      }),
      value: this.actor.system.abilities[ability]?.save.mod ?? null
    };
  }

  #getAttackBonus() {
    return {
      label: localize('A5E.AttackBonus'),
      value: this.rollData.attackBonus ?? 0
    };
  }

  #getConcentrationBonus() {
    if (this.rollData.saveType !== 'concentration') return null;

    return {
      label: localize('A5E.ConcentrationBonus'),
      value: this.actor.system.abilities.con.save.concentrationBonus
    };
  }

  #getExpertiseDice() {
    return {
      label: localize('A5E.ExpertiseDie'),
      value: getExpertiseDieSize(this.rollData?.expertiseDie ?? 0)
    };
  }

  #getGlobalAbilityCheckBonus() {
    return {
      label: localize('A5E.AbilityCheckBonusGlobal'),
      value: this.actor.system.bonuses.abilities.check.trim()
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

  #getGlobalSavingThrowBonus() {
    return {
      label: localize('A5E.AbilityCheckBonusGlobal'),
      value: this.actor.system.bonuses.abilities.save.trim()
    };
  }

  #getGlobalSkillCheckBonus() {
    // This is to prevent initiative bonuses including skill bonuses when no skill is selected.
    if (!this.rollData.skill) return null;

    return {
      label: localize('A5E.SkillCheckBonusGlobal'),
      value: this.actor.system.bonuses.abilities.skill.trim()
    };
  }

  #getInitiativeBonus() {
    return {
      label: localize('A5E.InitiativeBonus'),
      value: this.actor.system.attributes.initiative.bonus
    };
  }

  #getProficiencyBonus() {
    if (!this.rollData.proficient) return null;

    return {
      label: localize('A5E.ProficiencyBonusAbbr'),
      value: this.actor.system.attributes.prof
    };
  }

  #getSkillCheckModifier() {
    const { skill } = this.rollData;

    if (!skill) return null;

    return {
      label: localize('A5E.SkillCheckMod', { skill: CONFIG.A5E.skills[skill] }),
      value: this.actor.system.skills[skill]?.mod ?? null
    };
  }

  #getSkillCheckBonus() {
    const { skill } = this.rollData;

    if (!skill) return null;

    return {
      label: localize('A5E.SkillCheckBonus', { skill: CONFIG.A5E.skills[skill] }),
      value: this.actor.system.skills[skill]?.bonuses.check ?? null
    };
  }

  #getSituationalModifiers() {
    return { value: this.rollData.situationalMods };
  }
}
