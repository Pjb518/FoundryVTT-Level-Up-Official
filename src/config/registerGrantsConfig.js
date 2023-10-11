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
}
