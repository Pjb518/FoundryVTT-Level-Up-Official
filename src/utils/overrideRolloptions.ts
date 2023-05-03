import ActorA5e from "../documents/actor";

type options = {
  type: 'attack' | 'check' | 'save' | 'skill';
  attackType?: string;
  ability?: string;
  skill?: string;
  concentration?: boolean;
  deathSave?: boolean;
}

type overrideFlags = {
  abilityCheck?: { [key: string]: number };
  abilitySave?: { [key: string]: number };
  concentration?: number;
  deathSave?: number;
  attack?: { [key: string]: number };
  skillCheck?: { [key: string]: number };
}

/**
 * Overrides the rollMode based on activeEffect flags
 * @param {ActorA5e} actor
 * @param {Number} rollMode
 * @param {options} options
 * @returns {Number} rollMode
 */
export function overrideRollMode(actor: ActorA5e, rollMode: number, options: options): number {
  //@ts-ignore
  const flags: overrideFlags | undefined = actor.getFlag('a5e', 'effects.rollMode');
  if (!flags) return rollMode;

  const { attackType, ability, concentration, deathSave, skill, type } = options;

  if (type === 'attack') {
    if (typeof flags.attack?.all === 'number') return determineRollMode(rollMode, flags.attack.all);
    if (!attackType) return rollMode;

    if (flags.attack?.[attackType] && typeof flags.attack[attackType] === "number")
      return determineRollMode(rollMode, flags.attack[attackType]);;

    return rollMode;
  }

  if (type === 'check') {
    if (typeof flags.abilityCheck?.all === 'number') return determineRollMode(rollMode, flags.abilityCheck.all);
    if (!ability) return rollMode;

    if (flags.abilityCheck?.[ability] && typeof flags.abilityCheck[ability] === "number")
      return determineRollMode(rollMode, flags.abilityCheck[ability]);

    return rollMode;
  }

  if (type === 'save') {
    if (typeof flags.abilitySave?.all === 'number') return determineRollMode(rollMode, flags.abilitySave.all);
    if (!ability) {
      if (deathSave && typeof flags.deathSave === 'number')
        return determineRollMode(rollMode, flags.deathSave);

      return rollMode
    }

    if (flags.abilitySave?.[ability] && typeof flags.abilitySave[ability] === "number")
      return determineRollMode(rollMode, flags.abilitySave[ability]);

    if (concentration && ability === 'con' && typeof flags.concentration === 'number')
      return determineRollMode(rollMode, flags.concentration);

    return rollMode;
  }

  if (type === 'skill') {
    if (typeof flags.abilityCheck?.all === 'number') return determineRollMode(rollMode, flags.abilityCheck.all);
    if (!ability) return rollMode;

    if (flags.abilityCheck?.[ability] && typeof flags.abilityCheck[ability] === "number")
      return determineRollMode(rollMode, flags.abilityCheck[ability]);

    if (typeof flags.skillCheck?.all === 'number') return determineRollMode(rollMode, flags.skillCheck.all);
    if (!skill) return rollMode;

    if (flags.skillCheck?.[skill] && typeof flags.skillCheck[skill] === "number")
      return determineRollMode(rollMode, flags.skillCheck[skill]);

    return rollMode;
  }

  return rollMode;
}

/**
 *
 * @param actor
 * @param expertiseDie
 */
export function overrideExpertiseDie(actor: ActorA5e, dieCount: number): number {
  //@ts-ignore
  const flag: number | undefined = actor.getFlag('a5e', 'effects.expertiseDie');
  if (!flag) return dieCount;

  if (flag === 0) return 0;

  //@ts-ignore
  return Math.clamped(dieCount + flag, 0, 5)
}


function determineRollMode(original: number, override: number): number {
  const cancels = (original ^ override) < 0

  return cancels ? 0 : override;
}
