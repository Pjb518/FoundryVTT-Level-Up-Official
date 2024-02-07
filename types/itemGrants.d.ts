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
}

export type Grant = AbilityGrant | MovementGrant | ProficiencyGrant | SkillGrant | SensesGrant;
