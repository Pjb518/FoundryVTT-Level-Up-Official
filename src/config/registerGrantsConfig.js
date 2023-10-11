import { MovementGrant, SkillGrant, VisionGrant } from '../documents/item/data/Grant';

export const grantsClassMappings = {
  skill: SkillGrant,
  movement: MovementGrant,
  vision: VisionGrant
};

export default function registerGrantsConfig(A5E) {
  A5E.grantsClassMappings = grantsClassMappings;
}
