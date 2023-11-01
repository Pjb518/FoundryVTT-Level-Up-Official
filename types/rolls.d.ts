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
  attackType: AttackType;
  proficient: boolean;
}

interface DamageRoll extends BaseRoll {
  canCrit?: boolean;
  critBonus?: string;
  damageType?: DamageType;
  formula: string;
  scaling?: ScalingProperties;
}

interface GenericRoll extends BaseRoll {
  formula?: string;
}

interface HealingRoll extends BaseRoll {
  formula: string;
  healingType?: HealingType;
  scaling?: ScalingProperties;
}

interface SavingThrowRoll extends BaseRoll {
  ability: AbilityScoreKey | null;
}

interface SkillCheckRoll extends BaseRoll {
  ability?: AbilityScoreKey | 'none';
  skill: SkillKey;
}

interface ToolCheckRoll extends BaseRoll {
  ability: AbilityScoreKey | 'none';
  tool: string;
}

type Rolls = AbilityCheckRoll | AttackRoll | DamageRoll | GenericRoll | HealingRoll
  | SavingThrowRoll | SkillCheckRoll | ToolCheckRoll;
