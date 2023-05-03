import ActorA5e from "../documents/actor";

/**
 * Overrides the rollMode based on activeEffect flags
 * @param {ActorA5e} actor
 * @param {Number} rollMode
 * @param {options} options
 * @returns {Number} rollMode
 */
export default function overrideRollMode(actor: ActorA5e, rollMode: number, options: options): number {
  //@ts-ignore
  const flags: overrideFlags | undefined = actor.getFlag('a5e', 'effects.rollMode');
  if (!flags) return rollMode;

  const { attackType, ability, type } = options;

  if (type === 'attack') return overrideAttack(flags, rollMode, attackType);
  if (type === 'check') return overrideCheck(flags, rollMode, ability);
  if (type === 'save') return overrideSave(flags, rollMode, options);
  if (type === 'skill') return overrideSkill(flags, rollMode, options);

  return rollMode;
}

function determineRollMode(original: number, override: number): number {
  const cancels = (original ^ override) < -1;
  return cancels ? 0 : override;
}

function overrideAttack(flags: overrideFlags, rollMode: number, attackType: string | undefined): number {
  if (typeof flags.attack?.all === 'number') return determineRollMode(rollMode, flags.attack.all);
  if (!attackType) return rollMode;

  if (flags.attack?.[attackType] && typeof flags.attack[attackType] === "number")
    return determineRollMode(rollMode, flags.attack[attackType]);;

  return rollMode;
}

function overrideCheck(flags: overrideFlags, rollMode: number, ability: string | undefined): number {
  if (typeof flags.abilityCheck?.all === 'number') return determineRollMode(rollMode, flags.abilityCheck.all);
  if (!ability) return rollMode;

  if (flags.abilityCheck?.[ability] && typeof flags.abilityCheck[ability] === "number")
    return determineRollMode(rollMode, flags.abilityCheck[ability]);

  return rollMode;
}

function overrideSave(flags: overrideFlags, rollMode: number, options: options): number {
  const { ability, concentration, deathSave } = options;

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

function overrideSkill(flags: overrideFlags, rollMode: number, options: options): number {
  const { ability, skill } = options

  // Early exit if ability is being overridden
  const override = overrideCheck(flags, rollMode, ability);
  if (override !== rollMode) return override;

  if (typeof flags.skillCheck?.all === 'number') return determineRollMode(rollMode, flags.skillCheck.all);
  if (!skill) return rollMode;

  if (flags.skillCheck?.[skill] && typeof flags.skillCheck[skill] === "number")
    return determineRollMode(rollMode, flags.skillCheck[skill]);

  return rollMode;
}

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
