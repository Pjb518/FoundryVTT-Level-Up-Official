import AbilityGrant from './AbilityGrant';
import AttackGrant from './AttackGrant';
import BaseGrant from './BaseGrant';
import DamageGrant from './DamageGrant';
import ExpertiseDiceGrant from './ExpertiseDiceGrant';
import FeatureGrant from './FeatureGrant';
import HealingGrant from './HealingGrant';
import InitiativeGrant from './InitiativeGrant';
import ItemGrant from './ItemGrant';
import MovementGrant from './MovementGrant';
import ProficiencyGrant from './ProficiencyGrant';
import SkillGrant from './SkillGrant';
import SensesGrant from './SensesGrant';
import TraitGrant from './TraitGrant';
import HitPointGrant from './HitPointGrant';

export default {
  base: BaseGrant,
  ability: AbilityGrant,
  attack: AttackGrant,
  damage: DamageGrant,
  expertiseDice: ExpertiseDiceGrant,
  feature: FeatureGrant,
  healing: HealingGrant,
  hitPoint: HitPointGrant,
  initiative: InitiativeGrant,
  item: ItemGrant,
  movement: MovementGrant,
  proficiency: ProficiencyGrant,
  senses: SensesGrant,
  skill: SkillGrant,
  trait: TraitGrant
};
