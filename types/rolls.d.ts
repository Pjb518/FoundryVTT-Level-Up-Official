type RollTypes = 'abilityCheck' | 'attack' | 'damage' | 'generic' | 'healing' | 'savingThrow' | 'skillCheck' | 'toolCheck';

interface BaseRoll {
  default?: boolean;
  label?: string;
  type: RollTypes;
}

interface AbilityCheckRoll extends BaseRoll {
  ability: AbilityScoreKey;
}

interface AttackRoll extends BaseRoll {
  ability: AbilityScoreKey | 'none';
  attackType: AttackTypes;
  proficient: boolean;
}

interface DamageRoll extends BaseRoll {
  canCrit?: boolean;
  critBonus?: string;
  damageType?: DamageTypes;
  formula: string;
}

interface GenericRoll extends BaseRoll {
  formula?: string;
}

interface HealingRoll extends BaseRoll {
  formula: string;
  healingType?: HealingTypes;
}

interface SavingThrowRoll extends BaseRoll {
  ability: AbilityScoreKey | null;
}

interface SkillCheckRoll extends BaseRoll {
  ability?: AbilityScoreKey | 'none';
  skill: string;
}

interface ToolCheckRoll extends BaseRoll {
  ability: AbilityScoreKey | 'none';
  tool: string;
}

type Rolls = AbilityCheckRoll | AttackRoll | DamageRoll | GenericRoll | HealingRoll
  | SavingThrowRoll | SkillCheckRoll | ToolCheckRoll;
