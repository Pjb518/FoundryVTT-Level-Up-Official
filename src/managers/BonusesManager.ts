import type { Bonuses } from 'types/foundry/bonuses';

export default class BonusesManager {
  #actor: typeof Actor;

  #bonuses: Bonuses;

  constructor(actor: typeof Actor) {
    this.#actor = actor;
    this.#bonuses = this.#actor.system.bonuses ?? {};
  }

  getAbilityBonuses(
    ability: string,
    { proficient = false, type = 'check' }: { proficient?: boolean, type?: string } = {}
  ): string {
    const bonuses = this.#bonuses.abilities;

    const formula = Object.values(bonuses).reduce((acc, bonus) => {
      if (!bonus.context.abilities.includes(ability)) return acc;
      const bonusFormula = bonus.formula.trim();

      if (proficient && !bonus.context.proficient) return acc;
      if (!bonus.context.types.includes(type)) return acc;

      if (!acc.length) return `${bonusFormula}`;
      return `${acc} + ${bonusFormula}`;
    }, '');

    return formula;
  }
}
