import { AbilityGrant } from './AbilityGrant.ts';
import { AttackGrant } from './AttackGrant.ts';
import { BaseGrant } from './BaseGrant.ts';
import { CurrencyGrant } from './CurrencyGrant.ts';
import { DamageGrant } from './DamageGrant.ts';
import { ExertionGrant } from './ExertionGrant.ts';
import { ExpertiseDiceGrant } from './ExpertiseDiceGrant.ts';
import { FeatureGrant } from './FeatureGrant.ts';
import { HealingGrant } from './HealingGrant.ts';
import { HitPointGrant } from './HitPointGrant.ts';
import { InitiativeGrant } from './InitiativeGrant.ts';
import { ItemGrant } from './ItemGrant.ts';
import { MovementGrant } from './MovementGrant.ts';
import { ProficiencyGrant } from './ProficiencyGrant.ts';
import { RollOverrideGrant } from './RollOverrideGrant.ts';
import { SensesGrant } from './SensesGrant.ts';
import { SettingsGrant } from './SettingsGrant.ts';
import { SkillGrant } from './SkillGrant.ts';
import { SkillSpecialtyGrant } from './SkillSpecialtyGrant.ts';
import { SpellGrant } from './SpellGrant.ts';
import { TraitGrant } from './TraitGrant.ts';

export default {
	base: BaseGrant,
	ability: AbilityGrant,
	attack: AttackGrant,
	damage: DamageGrant,
	currency: CurrencyGrant,
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
	settings: SettingsGrant,
	skill: SkillGrant,
	skillSpecialty: SkillSpecialtyGrant,
	spell: SpellGrant,
	trait: TraitGrant,
};

export const ITEM_GRANT_TYPES = {
	ability: AbilityGrant,
	attack: AttackGrant,
	currency: CurrencyGrant,
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
	settings: SettingsGrant,
	skill: SkillGrant,
	skillSpecialty: SkillSpecialtyGrant,
	spell: SpellGrant,
	trait: TraitGrant,
};
