import overrideAttack from './overrides/overrideAttack';
import overrideCheck from './overrides/overrideCheck';
import overrideSave from './overrides/overrideSave';
import overrideSkill from './overrides/overrideSkill';

export type OverrideRollModeOptions = {
  type: 'attack' | 'check' | 'initiative' | 'save' | 'skill';
  attackType?: AttackTypes;
  ability?: AbilityScoreKey;
  skill?: string;
  concentration?: boolean;
  deathSave?: boolean;
};

export type OverrideFlags = {
  abilityCheck?: { [key: string]: number };
  abilitySave?: { [key: string]: number };
  attack?: { [key: string]: number };
  concentration?: number;
  deathSave?: number;
  initiative?: number;
  skillCheck?: { [key: string]: number };
};

/**
 * Overrides the rollMode based on activeEffect flags
 * @param {ActorA5e} actor
 * @param {Number} rollMode
 * @param {Options} options
 * @returns {Number} rollMode
 */
export default function overrideRollMode(
  actor: { getFlag: (scope: string, flag: string) => OverrideFlags; },
  rollMode: number,
  options: OverrideRollModeOptions
): number {
  // @ts-ignore
  const flags: OverrideFlags | undefined = actor.getFlag('a5e', 'effects.rollMode');
  if (!flags) return rollMode;

  const { attackType, ability, type } = options;

  if (type === 'attack') return overrideAttack(flags, rollMode, attackType);
  if (['check', 'initiative'].includes(type)) return overrideCheck(flags, rollMode, ability, type === 'initiative');
  if (type === 'save') return overrideSave(flags, rollMode, options);
  if (type === 'skill') return overrideSkill(flags, rollMode, options);

  return rollMode;
}
