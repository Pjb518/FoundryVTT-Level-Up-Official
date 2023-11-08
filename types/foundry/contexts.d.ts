export interface AbilityBonusContext {
  abilities: string[];
  types: string[];
  requiresProficiency: boolean;
}

export interface DamageBonusContext {
  attackTypes: string[];
  damageTypes: string[];
  spellLevels: string[];
}

export interface HealingBonusContext {
  healingTypes: string[];
  spellLevels: string[];
}

export interface SkillBonusContext {
  skills: string[];
  requiresProficiency: boolean;
}
