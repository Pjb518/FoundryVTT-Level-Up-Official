import AbilityGrant from "./AbilityGrant.ts";
import AttackGrant from "./AttackGrant.ts";
import BaseGrant from "./BaseGrant.ts";
import DamageGrant from "./DamageGrant.ts";
import ExertionGrant from "./ExertionGrant.ts";
import ExpertiseDiceGrant from "./ExpertiseDiceGrant.ts";
import FeatureGrant from "./FeatureGrant.ts";
import HealingGrant from "./HealingGrant.ts";
import HitPointGrant from "./HitPointGrant.ts";
import InitiativeGrant from "./InitiativeGrant.ts";
import ItemGrant from "./ItemGrant.ts";
import MovementGrant from "./MovementGrant.ts";
import ProficiencyGrant from "./ProficiencyGrant.ts";
import RollOverrideGrant from "./RollOverrideGrant.ts";
import SensesGrant from "./SensesGrant.ts";
import SkillGrant from "./SkillGrant.ts";
import SkillSpecialtyGrant from "./SkillSpecialtyGrant.ts";
import TraitGrant from "./TraitGrant.ts";

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
  trait: TraitGrant,
};
