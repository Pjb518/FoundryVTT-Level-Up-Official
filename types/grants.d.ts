export interface BaseGrant {
  _id: string;
  img: string;
  grantType: string;
  optional: boolean;

  applyGrant(applyData?: any): void;

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
  movementMode: string;
  ranges: {
    base: {
      distance: number,
      unit: string,
    },
    bonus: {
      distance: number,
      unit: string,
    },
  };
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

export interface VisionGrant extends BaseGrant {
  grantType: 'vision';
  visionMode: string;
  ranges: {
    base: {
      distance: number,
      unit: string,
    },
    bonus: {
      distance: number,
      unit: string,
    },
  };
}

export type Grant = AbilityGrant | MovementGrant | ProficiencyGrant | SkillGrant | VisionGrant;
