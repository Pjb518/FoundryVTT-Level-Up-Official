export interface AbilityBonusContext {
  abilities: string[];
  types: string[];
  requiresProficiency: boolean;
}

export interface AttackBonusContext {
  attackTypes: string[];
  // weaponTypes: string[];
  spellLevels: string[];
  requiresProficiency: boolean;
}

export interface DamageBonusContext {
  attackTypes: string[];
  damageTypes: string[];
  spellLevels: string[];
  isCritBonus: boolean;
}

export interface HealingBonusContext {
  healingTypes: string[];
  spellLevels: string[];
}

export interface InitiativeBonusContext {
  abilities: string[];
  skills: string[];
}

export interface SkillBonusContext {
  skills: string[];
  passiveOnly: boolean;
  requiresProficiency: boolean;
}
