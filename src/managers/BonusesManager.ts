import type { Bonuses } from 'types/foundry/bonuses';

import arraysAreEqual from '../utils/arraysAreEqual';

export default class BonusesManager {
  #actor: typeof Actor;

  #bonuses: Bonuses;

  #abilities: string[];

  #skills: string[];

  constructor(actor: typeof Actor) {
    this.#actor = actor;
    this.#bonuses = this.#actor.system.bonuses ?? {};

    this.#abilities = Object.keys(CONFIG.A5E.abilities);
    this.#skills = Object.keys(CONFIG.A5E.skills);
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Formula Wrappers for Bonus Calculations
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /**
   * Wrapper for {@link getAbilityBonuses} that returns a formula string instead of an array.
   *
   * @param abilityKey
   * @param type
   * @returns
   */
  getAbilityBonusesFormula(abilityKey: string, type: 'check' | 'save' = 'check'): string {
    const parts = this.getAbilityBonuses(abilityKey, type);
    console.log(parts);
    return parts.join(' + ');
  }

  /**
   * Wrapper for {@link getGlobalAbilityBonuses} that returns a formula string instead of an array.
   * @param type
   * @returns
   */
  getGlobalAbilityBonusesFormula(type: 'check' | 'save' = 'check'): string {
    const parts = this.getGlobalAbilityBonuses(type);
    return parts.join(' + ');
  }

  /**
   * Wrapper for {@link getSkillBonuses} that returns a formula string instead of an array.
   * @param skillKey
   * @param abilityKey
   * @param type
   * @param includeAbilityBonuses
   * @returns
   */
  getSkillBonusesFormula(
    skillKey: string,
    abilityKey?: string,
    type: 'check' | 'passive' = 'check',
    includeAbilityBonuses: boolean = true
  ): string {
    const parts = this.getSkillBonuses(skillKey, abilityKey, type, includeAbilityBonuses);
    return parts.join(' + ');
  }

  /**
   * Wrapper for {@link getGlobalSkillBonuses} that returns a formula string instead of an array.
   *
   * @param type
   * @returns
   */
  getGlobalSkillBonusesFormula(type: 'check' | 'passive' = 'check'): string {
    const parts = this.getGlobalSkillBonuses(type);
    return parts.join(' + ');
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Bonuses Calculations
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /**
   * Gets all bonuses for a given ability and type. This function requires an ability key and
   * a type. The type can be either 'check' or 'save'. The ability key must be a valid ability.
   *
   * Note: This function will also account for global bonuses that apply to all abilities.
   * If you want to get only the global bonuses, use the {@link getGlobalAbilityBonuses} function.
   *
   * @param abilityKey
   * @param type
   * @returns
   */
  getAbilityBonuses(abilityKey: string, type: 'check' | 'save' = 'check'): string[] {
    const bonuses = this.#bonuses.abilities;
    const ability = this.#actor.system.abilities[abilityKey];
    const isProficient = ability.save.proficient;

    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      if (!bonus.context.abilities.includes(abilityKey)) return acc;
      const bonusFormula = bonus.formula.trim();

      if (!bonus.context.types.includes(type)) return acc;
      if (bonus.context.requiresProficiency && !isProficient) return acc;

      if (!bonusFormula) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  /**
   * Gets all global ability bonuses for a given type. This function requires a type. The type
   * can be either 'check' or 'save'.
   *
   * Note: This function does not take an ability key, and as such can't account for
   * if proficiency is required for a particular bonus, therefore any bonus that
   * requiresProficiency is skipped. If you have a key for an ability, use the
   * {@link getAbilityBonuses} function instead.
   *
   * @param type
   * @returns
   */
  getGlobalAbilityBonuses(type: 'check' | 'save' = 'check'): string[] {
    const bonuses = this.#bonuses.abilities;
    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      const bonusFormula = bonus.formula.trim();
      if (!bonus.context.types.includes(type)) return acc;
      if (bonus.context.requiresProficiency) return acc;

      const isGlobalBonus = arraysAreEqual(bonus.context.abilities, this.#abilities);
      if (!isGlobalBonus) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  /**
   * Gets all bonuses for a given skill and ability. This function requires a skill key,
   * an optional ability key, and an optional type. The ability key must be a valid ability.
   * The skill key must be a valid skill. In the case that an ability key is not provided,
   * the default ability for the skill is used. In the case that a type is not provided,
   * the default type of 'check' is used. The type can be either 'check' or 'passive'.
   *
   * Note: This function will also account for global bonuses that apply to all skills. If you don't
   * have a key for a skill, use the {@link getGlobalSkillBonuses} function instead.
   *
   * @param skillKey
   * @param abilityKey
   * @param type
   * @param includeAbilityBonuses
   * @returns
   */
  getSkillBonuses(
    skillKey: string,
    abilityKey?: string,
    type: 'check' | 'passive' = 'check',
    includeAbilityBonuses: boolean = true
  ): string[] {
    const bonuses = this.#bonuses.skills;
    const skill = this.#actor.system.skills[skillKey];
    const defaultAbility = skill.ability;
    const isProficient = skill.proficient;

    const skillParts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      if (!bonus.context.skills.includes(skillKey)) return acc;
      if (bonus.bonusType !== type) return acc;

      const bonusFormula = bonus.formula.trim();

      if (bonus.context.requiresProficiency && !isProficient) return acc;
      if (!bonusFormula) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    if (!includeAbilityBonuses) return skillParts;

    const abilityParts = this.getAbilityBonuses(abilityKey ?? defaultAbility, 'check');
    return [...abilityParts, ...skillParts];
  }

  /**
   * Gets all global bonuses for skills.
   *
   * Note: This function does not take a skill key, and as such can't account for
   * if proficiency is required for a particular bonus, therefore any bonus that
   * requiresProficiency is skipped. If you have a key for a skill, use the
   * {@link getSkillBonuses} function instead.
   *
   * @param type
   * @returns
   */
  getGlobalSkillBonuses(type: 'check' | 'passive' = 'check'): string[] {
    const bonuses = this.#bonuses.skills;
    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      const bonusFormula = bonus.formula.trim();
      if (bonus.context.requiresProficiency) return acc;
      if (bonus.bonusType !== type) return acc;

      const isGlobalBonus = arraysAreEqual(bonus.context.skills, this.#skills);
      if (!isGlobalBonus) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }
}
