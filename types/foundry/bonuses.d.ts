import type {
  AbilityBonusContext, DamageBonusContext, HealingBonusContext, SkillBonusContext
} from './contexts';

export interface AbilityBonus {
  context: AbilityBonusContext;
  formula: string;
  label: string;
  default: boolean;
  defaultLabel?: string;
}

export interface DamageBonus {
  context: DamageBonusContext;
  damageType: string;
  formula: string;
  label: string;
  default: boolean;
  defaultLabel?: string;
}

export interface HealingBonus {
  context: HealingBonusContext;
  healingType: string;
  formula: string;
  label: string;
  default: boolean;
  defaultLabel?: string;
}

export interface SkillBonus {
  context: SkillBonusContext;
  formula: string;
  label: string;
  default: boolean;
  defaultLabel?: string;
}

export interface Bonuses {
  abilities: { [id: string]: AbilityBonus };
  damage: { [id: string]: DamageBonus };
  healing: { [id: string]: HealingBonus };
  skills: { [id: string]: SkillBonus };
  maneuverDC: string;
  meleeWeaponAttack: string;
  meleeSpellAttack: string;
  rangedWeaponAttack: string;
  rangedSpellAttack: string;
  spellDC: string;
}
