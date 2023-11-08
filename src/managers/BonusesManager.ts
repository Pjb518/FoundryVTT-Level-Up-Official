import type { Bonuses } from 'types/foundry/bonuses';

export default class BonusesManager {
  #actor: typeof Actor;

  #bonuses: Bonuses;

  constructor(actor: typeof Actor) {
    this.#actor = actor;
    this.#bonuses = this.#actor.system.bonuses ?? {};
  }

  getAbilityBonuses(
    abilityKey: string,
    type: string = 'check'
  ): string[] {
    const bonuses = this.#bonuses.abilities;
    const ability = this.#actor.system.abilities[abilityKey];
    const isProficient = ability.save.proficient;

    const parts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      if (!bonus.context.abilities.includes(abilityKey)) return acc;
      const bonusFormula = bonus.formula.trim();

      if (!bonus.context.types.includes(type)) return acc;
      if (bonus.context.requiresProficiency && !isProficient) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    return parts;
  }

  getSkillBonuses(skillKey: string, abilityKey: string) {
    const bonuses = this.#bonuses.skills;
    const skill = this.#actor.system.skills[skillKey];
    const defaultAbility = skill.ability;
    const isProficient = skill.proficient;

    const skillParts = Object.values(bonuses).reduce((acc: string[], bonus) => {
      if (!bonus.context.skills.includes(skillKey)) return acc;
      const bonusFormula = bonus.formula.trim();

      if (bonus.context.requiresProficiency && !isProficient) return acc;

      acc.push(bonusFormula);
      return acc;
    }, []);

    const abilityParts = this.getAbilityBonuses(abilityKey ?? defaultAbility, 'check');

    return [...abilityParts, ...skillParts];
  }
}
