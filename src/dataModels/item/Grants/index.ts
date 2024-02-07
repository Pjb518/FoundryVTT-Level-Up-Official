import AbilityGrant from './AbilityGrant';
import AttackGrant from './AttackGrant';
import BaseGrant from './BaseGrant';
import DamageGrant from './DamageGrant';
import HealingGrant from './HealingGrant';
import InitiativeGrant from './InitiativeGrant';
import MovementGrant from './MovementGrant';
import ProficiencyGrant from './ProficiencyGrant';
import SkillGrant from './SkillGrant';
import SensesGrant from './SensesGrant';
import TraitGrant from './TraitGrant';

export default {
  base: BaseGrant,
  ability: AbilityGrant,
  attack: AttackGrant,
  damage: DamageGrant,
  healing: HealingGrant,
  initiative: InitiativeGrant,
  movement: MovementGrant,
  proficiency: ProficiencyGrant,
  senses: SensesGrant,
  skill: SkillGrant,
  trait: TraitGrant
};
