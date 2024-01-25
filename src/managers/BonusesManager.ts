/* eslint-disable no-param-reassign */
import type {
  Bonuses,
  AbilityBonus,
  DamageBonus,
  HealingBonus,
  AttackBonus,
  InitiativeBonus,
  SkillBonus
} from 'types/foundry/bonuses';

import arraysAreEqual from '../utils/arraysAreEqual';

interface SelectionData {
  abilityKey?: string;
  abilityType?: 'base' | 'check' | 'save';
  attackType?: 'meleeWeaponAttack' | 'rangedWeaponAttack' | 'meleeSpellAttack' | 'rangedSpellAttack';
  item?: typeof Item;
  rolls?: any;
  skillKey?: string;
}

export default class BonusesManager {
  #actor: typeof Actor;

  #bonuses: Bonuses;

  constructor(actor: typeof Actor) {
    this.#actor = actor;
    this.#bonuses = this.#actor.system.bonuses ?? {};
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //  Utility Helpers
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  getDefaultSelections(key: string, data: SelectionData = {}): string[] {
    let bonuses: any;

    if (key === 'abilities' && data.abilityKey) {
      bonuses = this.prepareAbilityBonuses(data.abilityKey, (data.abilityType ?? 'check'));
    } else if (key === 'attacks' && data.item && data.attackType) {
      bonuses = this.prepareAttackBonuses(data.item, data.attackType);
    } else if (key === 'damage' && data.item && data.rolls) {
      bonuses = this.prepareGlobalDamageBonuses(data.item, data.rolls);
    } else if (key === 'healing' && data.item && data.rolls) {
      bonuses = this.prepareGlobalHealingBonuses(data.item, data.rolls);
    } else if (key === 'initiative' && (data.skillKey || data.abilityKey)) {
      bonuses = this.prepareInitiativeBonuses(
        { abilityKey: data.abilityKey, skillKey: data.skillKey }
      );
    } else if (key === 'skills' && data.skillKey) {
      bonuses = this.prepareSkillBonuses(data.skillKey, data.abilityKey, 'check', false);
    }

    if (!bonuses) return [];
    bonuses = { bonuses };
    const parts: [string, any][] = Object.values(bonuses ?? {}).flat() as [string, any][];

    return parts
      .reduce((acc: string[], [id, value]: [string, any]) => {
        if (!value.formula) return acc;
        if (value.default ?? true) acc.push(id);
        return acc;
      }, []);
  }

  getSelectedBonusesFormula(type: string, ids: string[]): string {
    const bonuses = this.#bonuses[type];
    const parts = ids.map((id) => bonuses[id]?.formula);
    return parts.join(' + ').trim();
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Formula Wrappers
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
    type: 'base' | 'check' | 'save' = 'check'
    // selectedBonuses: { enabled: boolean, ids: string[] } = { enabled: false, ids: [] }
  ): string {
    // const parts = this.getAbilityBonuses(abilityKey, type, selectedBonuses);
    const bonuses = this.prepareAbilityBonuses(abilityKey, type);
    const parts = bonuses.map(([, bonus]) => bonus.formula);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getGlobalAbilityBonuses} that returns a formula string instead of an array.
   * @param type
   * @returns
   */
  getGlobalAbilityBonusesFormula(type: 'base' | 'check' | 'save' = 'check'): string {
    const bonuses = this.prepareGlobalAbilityBonuses(type);
    const parts = bonuses.map(([, bonus]) => bonus.formula);
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
    const bonuses = this.prepareAttackBonuses(item, type);
    const parts = bonuses.map(([, bonus]) => bonus.formula);
    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getInitiativeBonuses} that returns a formula string instead of an array.
   * @param ablKey
   * @param skillKey
   * @returns
   */
  getInitiativeBonusFormula(
    { abilityKey, skillKey }: { abilityKey?: string, skillKey?: string } = {}
  ): string {
    const bonuses = this.prepareInitiativeBonuses({ abilityKey, skillKey });
    const parts = bonuses.map(([, bonus]) => bonus.formula);
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
    includeAbilityBonuses: boolean = false
  ): string {
    const bonuses = this.prepareSkillBonuses(skillKey, abilityKey, type, includeAbilityBonuses);
    const parts = bonuses.map(([, bonus]) => bonus.formula);

    // Expertise bonus addition for passive skills
    const skill = this.#actor.system.skills[skillKey];
    if (type === 'passive' && skill?.expertiseDice) parts.push('3');

    return parts.join(' + ').trim();
  }

  /**
   * Wrapper for {@link getGlobalSkillBonuses} that returns a formula string instead of an array.
   *
   * @param type
   * @returns
   */
  getGlobalSkillBonusesFormula(type: 'check' | 'passive' = 'check'): string {
    const bonuses = this.prepareGlobalSkillBonuses(type);
    const parts = bonuses.map(([, bonus]) => bonus.formula);
    return parts.join(' + ').trim();
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Bonuses Prepare Functions
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  prepareAbilityBonuses(ablKey: string, type: 'base' | 'check' | 'save' = 'check'): [string, AbilityBonus][] {
    const bonuses = this.#bonuses.abilities;
    const ability = this.#actor.system.abilities[ablKey];
    const isProficient = ability.save.proficient;
    const counts = {};

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { abilities, requiresProficiency, types } = context ?? {};

        if (!abilities?.includes(ablKey)) return false;
        if (!types?.includes(type)) return false;
        if (requiresProficiency && !isProficient) return false;

        return true;
      }
    );

    return parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.format('A5E.bonuses.labels.abilityBonusSpecific', {
          ability: game.i18n.localize(CONFIG.A5E.abilities[ablKey] ?? '')
        });

        counts[ablKey] ??= 0;
        counts[ablKey] += 1;

        bonus.defaultLabel = `${label} #${counts[ablKey]}`;
      }

      return [key, bonus];
    });
  }

  prepareGlobalAbilityBonuses(type: 'base' | 'check' | 'save' = 'check'): [string, AbilityBonus][] {
    const bonuses = this.#bonuses.abilities;
    let counts = 0;

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { abilities, requiresProficiency, types } = context ?? {};

        if (!types?.includes(type)) return false;
        if (requiresProficiency) return false;

        const isGlobalBonus = arraysAreEqual(abilities, Object.keys(CONFIG.A5E.abilities));
        if (!isGlobalBonus) return false;

        return true;
      }
    );

    return parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.localize('A5E.bonuses.labels.abilityBonusGlobal');

        counts += 1;
        bonus.defaultLabel = `${label} #${counts[key]}`;
      }

      return [key, bonus];
    });
  }

  prepareAttackBonuses(
    item: typeof Item,
    type: 'meleeWeaponAttack' | 'rangedWeaponAttack' | 'meleeSpellAttack' | 'rangedSpellAttack' = 'meleeWeaponAttack'
  ): [string, AttackBonus][] {
    const bonuses = this.#bonuses.attacks;
    const spellLevel = item.system.level ?? null;
    const counts = {};

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { attackTypes, spellLevels } = context ?? {};

        if (!attackTypes?.includes(type)) return false;
        if (spellLevel !== null && spellLevels.length && !spellLevels.includes(`${spellLevel}`)) return false;

        return true;
      }
    );

    return parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.format('A5E.bonuses.labels.attackBonusSpecific', {
          attackType: game.i18n.localize(CONFIG.A5E.attackTypes[type] ?? '')
        });

        counts[type] ??= 0;
        counts[type] += 1;

        bonus.defaultLabel = `${label} #${counts[type]}`;
      }

      return [key, bonus];
    });
  }

  /**
   *
   * @returns
   */
  prepareGlobalDamageBonuses(
    item: typeof Item,
    rolls: any
  ): [string, DamageBonus][] {
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
  ): [string, HealingBonus][] {
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

  prepareInitiativeBonuses(
    { abilityKey, skillKey }: { abilityKey?: string, skillKey?: string } = {}
  ): [string, InitiativeBonus][] {
    const bonuses = this.#bonuses.initiative;
    let counts = 0;

    abilityKey = abilityKey === 'none' ? undefined : abilityKey;
    skillKey = skillKey === 'none' ? undefined : skillKey;

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { abilities, skills } = context ?? {};

        if (abilityKey && abilities?.length && !abilities.includes(abilityKey)) return false;
        if (skillKey && skills?.length && !skills.includes(skillKey)) return false;

        return true;
      }
    );

    return parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.localize('A5E.bonuses.labels.initiativeBonus');
        counts += 1;
        bonus.defaultLabel = `${label} #${counts}`;
      }

      return [key, bonus];
    });
  }

  prepareSkillBonuses(
    skillKey: string,
    abilityKey?: string,
    type: 'check' | 'passive' = 'check',
    includeAbilityBonuses: boolean = false
  ): ([string, AbilityBonus] | [string, SkillBonus])[] {
    const bonuses = this.#bonuses.skills;
    const skill = this.#actor.system.skills[skillKey];
    const counts = {};
    if (!skill) return [];

    const defaultAbility = skill.ability;

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { skills, passiveOnly } = context ?? {};

        if (!skills.includes(skillKey)) return false;
        if (type !== 'passive' && passiveOnly) return false;

        return true;
      }
    );

    const skillParts: [string, SkillBonus][] = parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.format('A5E.bonuses.labels.skillBonusSpecific', {
          skill: game.i18n.localize(CONFIG.A5E.skills[skillKey] ?? '')
        });

        counts[skillKey] ??= 0;
        counts[skillKey] += 1;

        bonus.defaultLabel = `${label} #${counts[skillKey]}`;
      }

      return [key, bonus];
    });

    // Note: Expertise bonus for passive is applied in the formula wrapper
    if (!includeAbilityBonuses) return skillParts;

    const abilityParts: [string, AbilityBonus][] = this.prepareAbilityBonuses(abilityKey ?? defaultAbility, 'check');
    return [...abilityParts, ...skillParts];
  }

  prepareGlobalSkillBonuses(type: 'check' | 'passive' = 'check'): [string, SkillBonus][] {
    const bonuses = this.#bonuses.skills;
    let counts = 0;

    const parts = Object.entries(bonuses).filter(
      ([, { context, formula }]) => {
        if (!formula) return false;
        const { passiveOnly, requiresProficiency } = context ?? {};

        if (requiresProficiency) return false;
        if (type !== 'passive' && passiveOnly) return false;

        const isGlobalBonus = arraysAreEqual(context.skills, Object.keys(CONFIG.A5E.skills));
        if (!isGlobalBonus) return false;

        return true;
      }
    );

    return parts.map(([key, bonus]) => {
      if (!bonus.label) {
        const label = game.i18n.localize('A5E.bonuses.labels.skillBonusGlobal');

        counts += 1;
        bonus.defaultLabel = `${label} #${counts[key]}`;
      }

      return [key, bonus];
    });
  }
}
