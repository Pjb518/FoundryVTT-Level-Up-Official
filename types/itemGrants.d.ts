export interface BaseGrant {
  _id: string;
  default: boolean;
  img: string;
  grantType: string;
  label: string;
  optional: boolean;

  getApplyData(actor: Actor, data?: any): Record<string, any>;
  getSelectionComponent(): any;
  getSelectionComponentProps(): Record<string, any>;
  requiresConfig(): boolean;

  configureGrant(): void;
  deleteGrant(): void;

  parent: any;
}

export interface AbilityGrant extends BaseGrant {
  grantType: 'ability';
  abilities: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  context: {
    types: string[],
    requiresProficiency: boolean
  }
}

export interface AttackGrant extends BaseGrant {
  grantType: 'attack';
  attackTypes: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  context: {
    spellLevels: string[],
    requiresProficiency: boolean
  }
}

export interface DamageGrant extends BaseGrant {
  grantType: 'damage';
  bonus: string;
  damageType: string;
  context: {
    attackTypes: string[],
    damageTypes: string[],
    spellLevels: string[],
    isCritBonus: boolean
  }
}

export interface FeatureGrant extends BaseGrant {
  grantType: 'feature';
  features: {
    base: string[],
    options: string[],
    total: number,
  };
}

export interface HealingGrant extends BaseGrant {
  grantType: 'healing';
  bonus: string;
  healingType: string;
  context: {
    healingTypes: string[],
    spellLevels: string[]
  }
}

export interface InitiativeGrant extends BaseGrant {
  grantType: 'initiative';
  bonus: string;
  context: {
    abilities: string[],
    skills: string[]
  }
}

export interface ItemGrant extends BaseGrant {
  grantType: 'item';
  items: {
    base: {
      uuid: string,
      quantityOverride: number,
    }[],
    options: {
      uuid: string,
      quantityOverride: number,
    }[],
  }
  total: number,
}

export interface MovementGrant extends BaseGrant {
  grantType: 'movement';
  movementTypes: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  unit: string;
  context: {
    isHover: boolean
  }
}

export interface ProficiencyGrant extends BaseGrant {
  grantType: 'proficiency';
  keys: {
    base: string[],
    options: string[],
    total: number,
  };
  proficiencyType: string;
}

export interface SensesGrant extends BaseGrant {
  grantType: 'senses';
  senses: {
    base: string[],
    options: string[],
    total: number,
  };
  bonus: string;
  unit: string;
  context: {
    otherwiseBlind: boolean
  }
}

export interface SkillGrant extends BaseGrant {
  grantType: 'skill';
  choices: {
    base: string[],
    options: string[],
    total: number,
  };
  skillKey: string;
  bonus: string;
}

export interface TraitGrant extends BaseGrant {
  grantType: 'trait';
  traits: {
    base: string[],
    options: string[],
    total: number,
    traitType: string
  };
}

export type Grant = AbilityGrant
  | AttackGrant
  | DamageGrant
  | HealingGrant
  | FeatureGrant
  | InitiativeGrant
  | ItemGrant
  | MovementGrant
  | ProficiencyGrant
  | SensesGrant
  | SkillGrant
  | TraitGrant;
