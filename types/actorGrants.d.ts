export interface ActorBaseGrant {
  itemUuid: string;
  grantId: string;
  grantType: string;
  level: number;
}

export interface BonusGrant extends ActorBaseGrant {
  bonusId: string;
  type: string;
  grantType: 'bonus';
}

export interface ExertionGrant extends ActorBaseGrant {
  exertionData: {
    exertionType: 'bonus' | 'pool',
    bonusId: string | undefined,
    poolType: 'none' | 'prof' | 'doubleProf',
  };
  grantType: 'exertion';
}

export interface ExpertiseDiceGrant extends ActorBaseGrant {
  expertiseDiceData: {
    keys: string[],
    total: number,
    expertiseCount: number,
    expertiseType: string,
  };
  grantType: 'expertiseDice';
}

export interface FeatureGrant extends ActorBaseGrant {
  documentIds: string[];
  grantType: 'feature';
}

export interface ItemGrant extends ActorBaseGrant {
  documentIds: string[];
  grantType: 'item';
}

export interface ProficiencyGrant extends ActorBaseGrant {
  proficiencyData: {
    keys: string[],
    total: number,
    proficiencyType: string,
  };
  grantType: 'proficiency';
}

export interface RollOverrideGrant extends ActorBaseGrant {
  rollOverrideData: {
    keys: string[],
    total: number,
    rollOverrideType: string,
    rollMode: number,
  };
  grantType: 'rollOverride';
}

export interface SkillSpecialtyGrant extends ActorBaseGrant {
  specialtyData: {
    specialties: string[],
    skill: string,
    total: number,
  };
  grantType: 'skillSpecialty';
}

export interface TraitGrant extends ActorBaseGrant {
  traitData: {
    traits: string[],
    total: number,
    traitType: string,
  };
  grantType: 'trait';
}

export type ActorGrant = ActorBaseGrant
  | BonusGrant
  | FeatureGrant
  | ExertionGrant
  | ExpertiseDiceGrant
  | ItemGrant
  | ProficiencyGrant
  | RollOverrideGrant
  | SkillSpecialtyGrant
  | TraitGrant;
