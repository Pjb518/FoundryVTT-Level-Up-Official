import AbilityGrant from './AbilityGrant';
import BaseGrant from './BaseGrant';
import DamageGrant from './DamageGrant';
import HealingGrant from './HealingGrant';
import MovementGrant from './MovementGrant';
import SkillGrant from './SkillGrant';
import VisionGrant from './VisionGrant';

export default {
  base: BaseGrant,
  ability: AbilityGrant,
  damage: DamageGrant,
  healing: HealingGrant,
  movement: MovementGrant,
  skill: SkillGrant,
  vision: VisionGrant
};
