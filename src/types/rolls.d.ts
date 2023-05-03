interface BaseRoll {
  default?: boolean;
  label?: string;
  type: 'abilityCheck' | 'attack' | 'damage' | 'generic' | 'healing' | 'savingThrow' | 'skillCheck' | 'toolCheck';
}

interface AbilityCheckRoll extends BaseRoll {
  ability: AbilityScoreKey;
}

interface AttackRoll extends BaseRoll {
  ability: AbilityScoreKey | 'none';
  attackType: 'meleeSpellAttack' | 'meleeWeaponAttack' | 'rangedSpellAttack' | 'rangedWeaponAttack';
  proficient: boolean;
}

interface DamageRoll extends BaseRoll {
  canCrit?: boolean;
  critBonus?: string;
  damageType?: 'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic' | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';
  formula: string;
}

interface GenericRoll extends BaseRoll {
  formula?: string;
}

interface HealingRoll extends BaseRoll {
  formula: string;
  healingType?: 'healing' | 'temporaryHealing';
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
