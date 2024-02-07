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

export interface ProficiencyGrant extends ActorBaseGrant {
  proficiencyData: {
    keys: string[],
    total: number,
    proficiencyType: string,
  };
  grantType: 'proficiency';
}

export interface TraitGrant extends ActorBaseGrant {
  traitData: {
    traits: string[],
    total: number,
    traitType: string,
  };
  grantType: 'trait';
}

export type ActorGrant = BonusGrant | ProficiencyGrant | TraitGrant;
