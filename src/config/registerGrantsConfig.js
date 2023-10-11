import {
  MovementGrant, ProficiencyGrant, SkillGrant, VisionGrant
} from '../documents/item/data/Grant';

export const grantsClassMappings = {
  skill: SkillGrant,
  movement: MovementGrant,
  proficiency: ProficiencyGrant,
  vision: VisionGrant
};

export default function registerGrantsConfig(A5E) {
  A5E.grantsClassMappings = grantsClassMappings;
}
