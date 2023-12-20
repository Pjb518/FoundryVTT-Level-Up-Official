import * as GrantCls from '../dataModels/item/Grants';

export const grantsClassMappings = {
  ability: GrantCls.AbilityGrant,
  movement: GrantCls.MovementGrant,
  proficiency: GrantCls.ProficiencyGrant,
  skill: GrantCls.SkillGrant,
  trait: GrantCls.TraitGrant,
  vision: GrantCls.VisionGrant,
  default: GrantCls.BaseGrant
};

export const grantTypes = {
  ability: {
    heading: 'A5E.grants.ability',
    singleLabel: 'A5E.Ability',
    component: null
  },
  skill: {
    heading: 'A5E.grants.skill',
    singleLabel: 'A5E.Skill',
    component: null
  },
  movement: {
    heading: 'A5E.grants.movement',
    singleLabel: 'A5E.Movement',
    component: null
  },
  proficiency: {
    heading: 'A5E.grants.proficiency',
    singleLabel: 'A5E.Proficiency',
    component: null
  },
  trait: {
    heading: 'A5E.grants.trait',
    singleLabel: 'A5E.Trait',
    component: null
  },
  vision: {
    heading: 'A5E.grants.vision',
    singleLabel: 'A5E.Vision',
    component: null
  }
};

export default function registerGrantsConfig(A5E) {
  A5E.grantsClassMappings = grantsClassMappings;

  A5E.itemGrants = {
    ability: 'A5E.Ability',
    movement: 'A5E.Movement',
    proficiency: 'A5E.Proficiency',
    skill: 'A5E.Skill',
    trait: 'A5E.Trait',
    vision: 'A5E.Vision'
  };
}
