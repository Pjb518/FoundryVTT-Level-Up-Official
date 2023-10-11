import {
  MovementGrant, ProficiencyGrant, SkillGrant, TraitGrant, VisionGrant
} from '../documents/item/data/Grant';

export const grantsClassMappings = {
  skill: SkillGrant,
  movement: MovementGrant,
  proficiency: ProficiencyGrant,
  trait: TraitGrant,
  vision: VisionGrant
};

export default function registerGrantsConfig(A5E) {
  A5E.grantsClassMappings = grantsClassMappings;

  A5E.itemGrants = {
    skill: 'A5E.Skill',
    movement: 'A5E.Movement',
    proficiency: 'A5E.Proficiency',
    trait: 'A5E.Trait',
    vision: 'A5E.Vision'
  };
}
