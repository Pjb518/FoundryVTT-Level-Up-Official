/* eslint-disable no-param-reassign */
import type { Bonuses, DamageBonus, HealingBonus } from 'types/foundry/bonuses';

import arraysAreEqual from '../utils/arraysAreEqual';

export type DamageBonusCriteria = {
  attackTypes: string[];
  damageTypes: string[];
  spellLevels: number[];
};

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
   * @param selectedBonuses
   * @returns
   */
  getAbilityBonusesFormula(
    abilityKey: string,
    type: 'base' | 'check' | 'save' = 'check',
    selectedBonuses: { enabled: boolean, ids: string[] } = { enabled: false, ids: [] }
  ): string {
    const parts = this.getAbilityBonuses(abilityKey, type, selectedBonuses);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getGlobalAbilityBonuses} that returns a formula string instead of an array.
   * @param type
   * @returns
   */
  getGlobalAbilityBonusesFormula(type: 'base' | 'check' | 'save' = 'check'): string {
    const parts = this.getGlobalAbilityBonuses(type);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getAttackBonuses} that returns a formula string instead of an array.
   * @param item
   * @param type
   * @returns
   */
  getAttackBonusFormula(
    item: typeof Item,
    type: 'meleeWeaponAttack' | 'rangedWeaponAttack' | 'meleeSpellAttack' | 'rangedSpellAttack' = 'meleeWeaponAttack'
  ): string {
    const parts = this.getAttackBonuses(item, type);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getInitiativeBonuses} that returns a formula string instead of an array.
   * @param ablKey
   * @param skillKey
   * @returns
   */
  getInitiativeBonusFormula(ablKey?: string, skillKey?: string): string {
    const parts = this.getInitiativeBonuses(ablKey, skillKey);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getSkillBonuses} that returns a formula string instead of an array.
   * @param skillKey              The skill key to get bonuses for.
   * @param abilityKey            The ability key to get bonuses for. If not provided, the default
   * @param type                  The type of bonus to get. Can be either 'check' or 'passive'.
   * @param includeAbilityBonuses Whether or not to include ability bonuses in the formula.
   * @param selectedBonuses       Whether or not to include only selected bonuses.
   * @returns
   */
  getSkillBonusesFormula(
    skillKey: string,
    abilityKey?: string,
    type: 'check' | 'passive' = 'check',
    includeAbilityBonuses: boolean = true,
    selectedBonuses: { enabled: boolean, ids: string[] } = { enabled: false, ids: [] }
  ): string {
    const parts = this.getSkillBonuses(
      skillKey,
      abilityKey,
      type,
      includeAbilityBonuses,
      selectedBonuses
    );
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getGlobalSkillBonuses} that returns a formula string instead of an array.
   *
   * @param type
   * @returns
   */
  getGlobalSkillBonusesFormula(type: 'check' | 'passive' = 'check'): string {
    const parts = this.getGlobalSkillBonuses(type);
    return parts.join(' + ').trim();
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
   * @param selectedBonuses
   * @returns
   */
  getAbilityBonuses(
    abilityKey: string,
    type: 'base' | 'check' | 'save' = 'check',
    selectedBonuses: { enabled: boolean, ids: string[] } = { enabled: false, ids: [] }
  ): string[] {
    const bonuses = this.#bonuses.abilities;
    const ability = this.#actor.system.abilities[abilityKey];
    const isProficient = ability.save.proficient;

    const parts = Object.entries(bonuses).reduce((acc: string[], [id, bonus]) => {
      if (selectedBonuses.enabled) {
        if (!selectedBonuses.ids.includes(id)) return acc;
      } else if (!bonus.default) return acc;

      if (!bonus.context.abilities?.includes(abilityKey)) return acc;
      const bonusFormula = bonus.formula.trim();

      if (!bonus.context.types?.includes(type)) return acc;
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
  getGlobalAbilityBonuses(type: 'base' | 'check' | 'save' = 'check'): string[] {
    const bonuses = this.#bonuses.abilities;
    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      const bonusFormula = bonus.formula.trim();
      if (!bonus.default) return acc;
      if (!bonus.context.types?.includes(type)) return acc;
      if (bonus.context.requiresProficiency) return acc;

      const isGlobalBonus = arraysAreEqual(bonus.context.abilities, this.#abilities);
      if (!isGlobalBonus) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  getAttackBonuses(
    item: typeof Item,
    type: 'meleeWeaponAttack' | 'rangedWeaponAttack' | 'meleeSpellAttack' | 'rangedSpellAttack' = 'meleeWeaponAttack'
  ): string[] {
    const bonuses = this.#bonuses.attacks;
    const spellLevel = item.system.level ?? null;

    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      const bonusFormula = bonus.formula.trim();
      if (!bonusFormula) return acc;

      const { attackTypes, spellLevels } = bonus.context ?? {};

      if (attackTypes?.length && !attackTypes.includes((type))) return acc;
      if (spellLevel !== null && spellLevels.length && !spellLevels.includes(`${spellLevel}`)) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  /**
   * Gets all bonuses for initiative. This function can be passed an ability key or a skill key.
   * If an ability key is passed, it will return all bonuses that apply to that ability. If a skill
   * key is passed, it will return all bonuses that apply to that skill. If neither are passed, it
   * will return all bonuses that apply to initiative.
   *
   * @param ablKey
   * @param skillKey
   * @returns
   */
  getInitiativeBonuses(ablKey?: string, skillKey?: string): string[] {
    const bonuses = this.#bonuses.initiative;
    ablKey = ablKey === 'none' ? undefined : ablKey;
    skillKey = skillKey === 'none' ? undefined : skillKey;

    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      const bonusFormula = bonus.formula.trim();
      if (!bonusFormula) return acc;

      const { abilities, skills } = bonus.context ?? {};

      if (ablKey && abilities?.length && !abilities.includes(ablKey)) return acc;
      if (skillKey && skills?.length && !skills.includes(skillKey)) return acc;

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
   * @param selectedBonuses
   * @returns
   */
  getSkillBonuses(
    skillKey: string,
    abilityKey?: string,
    type: 'check' | 'passive' = 'check',
    includeAbilityBonuses: boolean = true,
    selectedBonuses: { enabled: boolean, ids: string[] } = { enabled: false, ids: [] }
  ): string[] {
    const bonuses = this.#bonuses.skills;
    const skill = this.#actor.system.skills[skillKey];
    if (!skill) return [];

    const defaultAbility = skill.ability;
    const isProficient = skill.proficient;

    const skillParts = Object.entries(bonuses).reduce((acc: string[], [id, bonus]) => {
      if (selectedBonuses.enabled) {
        if (!selectedBonuses.ids.includes(id)) return acc;
      } else if (!bonus.default) return acc;

      if (!bonus.context.skills.includes(skillKey)) return acc;
      if (type !== 'passive' && bonus.context.passiveOnly) return acc;

      const bonusFormula = bonus.formula.trim();

      if (bonus.context.requiresProficiency && !isProficient) return acc;
      if (!bonusFormula) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    // Add expertise bonus if applicable
    if (type === 'passive' && skill.expertiseDice) skillParts.push('3');

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
      if (!bonus.default) return acc;
      const bonusFormula = bonus.formula.trim();
      if (bonus.context.requiresProficiency) return acc;
      if (type !== 'passive' && bonus.context.passiveOnly) return acc;

      const isGlobalBonus = arraysAreEqual(bonus.context.skills, this.#skills);
      if (!isGlobalBonus) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  /**
   * Gets all damage bonuses given certain criteria. This function requires
   * an item and rolls to be passed to it.
   *
   *
   * @returns
   */
  prepareGlobalDamageBonuses(
    item: typeof Item,
    rolls: any
  ): (string | DamageBonus)[][] {
    const attackRoll: any[] = rolls.attack ?? [];
    const damageRoll: any[] = rolls.damage ?? [];
    const spellLevel = item.system.level ?? null;

    if (!Array.isArray(attackRoll)) return [];
    if (!attackRoll.length) return [];

    const { attackType }: { attackType: string } = attackRoll[0][1] ?? {};
    const damages = new Set(damageRoll.map(([, { damageType }]) => damageType));
    const bonuses = this.#bonuses.damage ?? {};
    const counts = {};

    const damageBonuses = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { attackTypes, spellLevels } = context;
        const damageTypes = new Set(context.damageTypes ?? []);

        if (attackTypes?.length && !attackTypes.includes((attackType || 'meleeWeaponAttack'))) return false;
        if (spellLevel !== null && spellLevels.length && !spellLevels.includes(`${spellLevel}`)) return false;
        if (damageTypes.size && !damageTypes.intersects(damages)) return false;

        return true;
      }
    );

    return damageBonuses.map(([key, damageBonus]) => {
      if (!damageBonus.label) {
        const label = game.i18n.format('A5E.DamageBonusSpecific', {
          damageType: game.i18n.localize(CONFIG.A5E.damageTypes[damageBonus.damageType] ?? '')
        });

        counts[damageBonus.damageType] ??= 0;
        counts[damageBonus.damageType] += 1;

        damageBonus.defaultLabel = `${label} #${counts[damageBonus.damageType]}`;
      }

      return [key, damageBonus];
    });
  }

  prepareGlobalHealingBonuses(
    item: typeof Item,
    rolls: any
  ): (string | HealingBonus)[][] {
    const bonuses = this.#bonuses.healing;
    const counts = {};

    const healingRolls = rolls.healing ?? [];
    const spellLevel = item.system.level ?? null;

    if (!healingRolls.length) return [];

    const heals: Set<string> = new Set(healingRolls.map(([, { healingType }]) => healingType));

    const healingBonuses = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;

        const { spellLevels } = context;
        const healingTypes = new Set(context.healingTypes ?? []);

        if (healingTypes.size && !healingTypes.intersects(heals)) return false;
        if (spellLevel !== null && spellLevels.length && !spellLevels.includes(`${spellLevel}`)) return false;

        return true;
      }
    );

    return healingBonuses.map(([key, healingBonus]) => {
      const healingType = healingBonus.healingType || 'healing';

      if (!healingBonus.label) {
        const label = game.i18n.localize(CONFIG.A5E.healingTypes[healingType]);

        counts[healingType] ??= 0;
        counts[healingType] += 1;

        healingBonus.defaultLabel = `${label} #${counts[healingType]}`;
      }

      return [key, healingBonus];
    });
  }
}
