import AbilityGrant from './AbilityGrant';
import AttackGrant from './AttackGrant';
import BaseGrant from './BaseGrant';
import DamageGrant from './DamageGrant';
import HealingGrant from './HealingGrant';
import InitiativeGrant from './InitiativeGrant';
import MovementGrant from './MovementGrant';
import SkillGrant from './SkillGrant';
import VisionGrant from './VisionGrant';

export default {
  base: BaseGrant,
  ability: AbilityGrant,
  attack: AttackGrant,
  damage: DamageGrant,
  healing: HealingGrant,
  initiative: InitiativeGrant,
  movement: MovementGrant,
  skill: SkillGrant,
  vision: VisionGrant
};
