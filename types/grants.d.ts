export interface ActorBaseGrant {
  itemUuid: string;
  grantId: string;
  grantType: string;
}

export interface BonusGrant extends ActorBaseGrant {
  bonusId: string;
  type: string;
  grantType: 'bonus';
}

export interface TraitGrant extends ActorBaseGrant {
  traitData: {
    traits: string[],
    total: number,
    traitType: string,
  };
  grantType: 'trait';
}

export type ActorGrant = BonusGrant | TraitGrant;

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
  label: string;
}

export interface ProficiencyGrant extends BaseGrant {
  grantType: 'proficiency';
  choices: {
    base: string[],
    options: string[],
    total: number,
  };
  proficiencyKey: string;
  proficiencyType: string;
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
  label: string;
}

export type Grant = AbilityGrant | MovementGrant | ProficiencyGrant | SkillGrant | SensesGrant;
