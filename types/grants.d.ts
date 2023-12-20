export interface BaseGrant {
  _id: string;
  img: string;
  grantType: string;
  level: number;
  optional: boolean;
}

export interface AbilityGrant extends BaseGrant {
  grantType: 'ability';
  abilities: string[];
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
