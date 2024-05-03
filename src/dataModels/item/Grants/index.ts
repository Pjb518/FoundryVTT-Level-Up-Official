import AbilityGrant from './AbilityGrant';
import AttackGrant from './AttackGrant';
import BaseGrant from './BaseGrant';
import DamageGrant from './DamageGrant';
import ExertionGrant from './ExertionGrant';
import ExpertiseDiceGrant from './ExpertiseDiceGrant';
import FeatureGrant from './FeatureGrant';
import HealingGrant from './HealingGrant';
import HitPointGrant from './HitPointGrant';
import InitiativeGrant from './InitiativeGrant';
import ItemGrant from './ItemGrant';
import MovementGrant from './MovementGrant';
import ProficiencyGrant from './ProficiencyGrant';
import RollOverrideGrant from './RollOverrideGrant';
import SensesGrant from './SensesGrant';
import SkillGrant from './SkillGrant';
import SkillSpecialtyGrant from './SkillSpecialtyGrant';
import TraitGrant from './TraitGrant';

export default {
  base: BaseGrant,
  ability: AbilityGrant,
  attack: AttackGrant,
  damage: DamageGrant,
  exertion: ExertionGrant,
  expertiseDice: ExpertiseDiceGrant,
  feature: FeatureGrant,
  healing: HealingGrant,
  hitPoint: HitPointGrant,
  initiative: InitiativeGrant,
  item: ItemGrant,
  movement: MovementGrant,
  proficiency: ProficiencyGrant,
  rollOverride: RollOverrideGrant,
  senses: SensesGrant,
  skill: SkillGrant,
  skillSpecialty: SkillSpecialtyGrant,
  trait: TraitGrant
};
