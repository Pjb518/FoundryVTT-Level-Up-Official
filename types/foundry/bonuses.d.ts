import type {
  AbilityBonusContext,
  AttackBonusContext,
  DamageBonusContext,
  HealingBonusContext,
  InitiativeBonusContext,
  SkillBonusContext
} from './contexts';

export interface AbilityBonus {
  context: AbilityBonusContext;
  formula: string;
  label: string;
  img: string;
  default: boolean;
  defaultLabel?: string;
}

export interface AttackBonus {
  context: AttackBonusContext;
  formula: string;
  label: string;
  img: string;
  default: boolean;
  defaultLabel?: string;
}

export interface DamageBonus {
  context: DamageBonusContext;
  damageType: string;
  formula: string;
  label: string;
  img: string;
  default: boolean;
  defaultLabel?: string;
}

export interface HealingBonus {
  context: HealingBonusContext;
  healingType: string;
  formula: string;
  label: string;
  img: string;
  default: boolean;
  defaultLabel?: string;
}

export interface InitiativeBonus {
  context: InitiativeBonusContext;
  formula: string;
  label: string;
  img: string;
}

export interface SkillBonus {
  context: SkillBonusContext;
  formula: string;
  label: string;
  img: string;
  default: boolean;
  defaultLabel?: string;
}

export interface Bonuses {
  abilities: { [id: string]: AbilityBonus };
  attacks: { [id: string]: AttackBonus };
  damage: { [id: string]: DamageBonus };
  healing: { [id: string]: HealingBonus };
  initiative: { [id: string]: InitiativeBonus };
  skills: { [id: string]: SkillBonus };
  maneuverDC: string;
  meleeWeaponAttack: string;
  meleeSpellAttack: string;
  rangedWeaponAttack: string;
  rangedSpellAttack: string;
  spellDC: string;
}
