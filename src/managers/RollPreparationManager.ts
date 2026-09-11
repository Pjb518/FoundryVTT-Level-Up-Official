import { localize } from '#utils/localization/localize.ts';
import type {
	AbilityCheckRollData,
	DamageRollData,
	GenericRollData,
	HealingRollData,
	SavingThrowRollData,
	SkillCheckRollData,
	ToolCheckRollData,
} from '../dataModels/item/actions/ActionRollsDataModel.ts';
import { constructD20RollFormula } from '../dice/constructD20RollFormula.ts';
import { constructRollFormula } from '../dice/constructRollFormula.ts';
import { constructCriticalConfig } from '../dice/damage/constructCriticalConfig.ts';
import { DamageRoll } from '../dice/rolls/DamageRoll.ts';
import type { ItemA5e } from '../documents/item/item.ts';
import type { RollStateManager } from './RollStateManager.ts';

class RollPreparationManager {
	#actor: Actor.OfType<'base'>;

	#item: ItemA5e;

	#state: RollStateManager.WorkflowState;

	constructor(state: RollStateManager.WorkflowState) {
		this.#actor = state.actor;
		this.#item = state.item;

		this.#state = state;
	}

	/** ================================================ */
	//  Preparation Methods
	/** ================================================ */
	async prepareRolls() {
		const state = this.#state;

		const attackRoll = await this.#prepareAttackRoll(state.attack);

		let hasDamageRoll = false;
		let hasHealingRoll = false;
		let hasTempHealing = false;

		const prepared = await Promise.all(
			state.rolls.map(async (roll) => {
				if (roll.type === 'attack') return attackRoll;

				if (roll.type === 'damage') {
					hasDamageRoll = true;
					return await this.#prepareDamageRoll(roll, attackRoll, { applyGenericBonus: true });
				}

				if (roll.type === 'healing') {
					const healingType = roll.healingType;
					if (healingType === 'temporaryHealing') hasTempHealing = true;
					else hasHealingRoll = true;

					return await this.#prepareHealingRoll(roll);
				}

				const otherRoll = await this.#prepareItemRoll(roll);
				return otherRoll;
			}),
		);

		if (hasDamageRoll) {
			prepared.push(...(await this.#prepareBonusDamageRolls(attackRoll)));
		}

		if (hasHealingRoll) {
			prepared.push(...(await this.#prepareBonusHealingRolls()));
		}

		if (hasTempHealing) {
			prepared.push(...(await this.#prepareBonusTempHealingRolls()));
		}

		return [attackRoll, ...prepared].filter(Boolean);
	}

	#prepareItemRoll(roll: any) {
		switch (roll?.type) {
			case 'abilityCheck':
				return this.#prepareAbilityCheckRoll(roll);
			case 'generic':
				return this.#prepareGenericRoll(roll);
			case 'savingThrow':
				return this.#prepareSavingThrowRoll(roll);
			case 'skillCheck':
				return this.#prepareSkillCheckRoll(roll);
			case 'toolCheck':
				return this.#prepareToolCheckRoll(roll);
			default:
				return null;
		}
	}

	async #prepareAbilityCheckRoll(_roll: AbilityCheckRollData & ExtraRollData) {
		if (_roll.formulaInvalid) return null;

		const defaultData = this.#actor.getDefaultAbilityCheckData(_roll.ability, {
			situationalMods: _roll.bonus,
		});

		const rollFormula = _roll.rollFormula ?? (defaultData.rollFormula as string);
		if (!rollFormula) return null;

		const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
		const roll = await new Roll(rollFormula).evaluate();
		const label = localize('A5E.abilities.headings.checkSpecific', { ability });

		return {
			expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
			label,
			userLabel: _roll.label,
			roll,
			rollMode: _roll.rollMode ?? defaultData.rollMode,
			type: 'abilityCheck',
		};
	}

	async #prepareAttackRoll(_roll: RollStateManager.WorkflowState['attack']) {
		if (!_roll) return null;

		// For sanity check that a formula would work ?
		const { rollFormula } = constructRollFormula({
			actor: this.#actor,
			formula: _roll.formula,
			item: this.#item,
		});
		if (!rollFormula) return null;

		// TODO: Move this to formula creation
		const globalCritThreshold = _roll.attackType.includes('Weapon')
			? (this.#actor.getFlag('a5e', 'criticalHitThresholdWeapon') ?? 20)
			: (this.#actor.getFlag('a5e', 'criticalHitThresholdSpell') ?? 20);

		const critThreshold = Math.min(globalCritThreshold, _roll.critThreshold ?? 20);

		const roll = await CONFIG.Dice.D20Roll.fromTerms(_roll.terms).evaluate();
		const label = localize(CONFIG.A5E.attackTypes[_roll?.attackType ?? 'meleeWeaponAttack']);

		const isCrit = ((roll.dice[0].total as number) ?? 0) >= critThreshold;

		return {
			attackType: _roll.attackType,
			critThreshold,
			expertise: _roll.expertiseDie,
			isCrit,
			label,
			roll,
			rollMode: _roll.rollMode,
			type: 'attack',
		};
	}

	async #prepareBonusDamageRolls(attackRoll: RollStateManager.WorkflowState['attack']) {
		const damageBonuses = this.#state.damageBonuses;

		const bonusDamage = Object.values(damageBonuses).filter(
			({ damageType }) => damageType && damageType !== 'null',
		);

		return Promise.all(
			bonusDamage.map(({ label, formula, damageType, context }) =>
				this.#prepareDamageRoll(
					{
						label,
						formula,
						canCrit: true,
						critBonus: '',
						damageType,
						getFormula: () => formula,
					} as DamageRollData,
					attackRoll,
					{ context },
				),
			),
		);
	}

	async #prepareBonusHealingRolls() {
		const bonusHealing = this.#state.healingBonuses.filter(
			({ healingType }) => healingType === 'healing' || !healingType,
		);

		return Promise.all(
			bonusHealing.map(({ label, formula, healingType }) =>
				this.#prepareHealingRoll({
					label: label || 'Bonus Healing',
					formula,
					healingType: healingType || 'healing',
					getFormula: () => formula,
				} as unknown as HealingRollData),
			),
		);
	}

	async #prepareBonusTempHealingRolls() {
		const bonusHealing = this.#state.healingBonuses.filter(
			({ healingType }) => healingType === 'temporaryHealing',
		);

		return Promise.all(
			bonusHealing.map(({ label, formula, healingType }) =>
				this.#prepareHealingRoll({
					label: label || 'Bonus Temporary Healing',
					formula,
					healingType,
					getFormula: () => formula,
				} as unknown as HealingRollData),
			),
		);
	}

	async #prepareDamageRoll(
		_roll: DamageRollData,
		attackRoll: RollStateManager.WorkflowState['attack'],
		{ applyGenericBonus = false, context = {} }: RollPreparationManager.DamageRollOptions = {},
	): Promise<PreparedDamageData | null> {
		const { isCrit } = attackRoll ?? {};
		const { canCrit, critBonus, damageType } = _roll ?? {};

		// Apply Generic Bonuses to all damage rolls that aren't bonuses
		const critBonuses: string[] = [];
		let critBonusFormula = critBonus || '';
		let genericCritBonusDamage = '';
		const modifiers: { value: string; label: string }[] = [];

		if (applyGenericBonus) {
			const genericBonusDamage = this.#prepareGenericBonusDamage(); // TODO: Had a isCrit param?

			genericBonusDamage.forEach((bonus) => {
				if (bonus.context?.isCritBonus) critBonuses.push(bonus.formula);
				else modifiers.push({ value: bonus.formula, label: bonus.label });
			});

			if (critBonuses.length) genericCritBonusDamage = critBonuses.join(' + ');
		}
		critBonusFormula += genericCritBonusDamage ? ` + ${genericCritBonusDamage}` : '';

		// We're using this to get a roll formula with bonuses
		const { rollFormula } = constructRollFormula({
			actor: this.#actor,
			formula: this.#applyScaling(_roll),
			item: this.#item,
			modifiers,
		});
		if (!rollFormula) return null;

		// Construct Rolls
		const roll = new DamageRoll(rollFormula, this.#actor.getRollData(this.#item));

		// Construct Critical roll
		const critFormula = rollFormula;
		const critConfig = constructCriticalConfig();
		const critRoll = new DamageRoll(critFormula, this.#actor.getRollData(this.#item), {
			isCrit: canCrit ?? true,
			critical: {
				...critConfig,
				bonusDamage: critBonusFormula,
			},
		});

		// TODO: Update the terms to reflect roll

		// const r = await new Roll(rollFormula).evaluate();
		// let baseRoll = Roll.fromTerms(simplifyDiceTerms(r.terms));
		// let roll = baseRoll;
		// let critRoll = baseRoll;

		// if (canCrit ?? true) {
		// 	if (context?.isCritBonus) {
		//    Left
		//    critRoll = roll;
		// 		baseRoll = await new Roll('0').evaluate();
		// 		roll = baseRoll;
		// 	} else {
		//    Done ------
		// 		let bonus = critBonus || '';
		// 		bonus += genericCritBonusDamage ? ` + ${genericCritBonusDamage}` : '';
		// 		critRoll = await constructCritDamageRoll(roll, bonus);
		// 	}
		// }

		// if (isCrit) roll = critRoll;

		const label = damageType
			? localize('A5E.damage.labels.specific', {
					damageType: localize(CONFIG.A5E.damageTypes[damageType]),
				})
			: localize('A5E.damage.title');

		return {
			// baseRoll: baseRoll as EvaluatedRoll,
			canCrit: canCrit ?? true,
			critRoll: await critRoll.evaluate(),
			damageType,
			label,
			userLabel: _roll.label,
			roll: await roll.evaluate(),
			type: 'damage',
		};
	}

	/**
	 * Prepares the damage bonuses without any damage type. These are folded into the first
	 * damage roll for the action.
	 */
	#prepareGenericBonusDamage() {
		const genericBonusDamage = (this.#state.damageBonuses ?? []).filter(
			({ damageType }) => !damageType || damageType === 'null',
		);

		return genericBonusDamage.map(({ formula, context, label }) => ({
			formula,
			context,
			label,
			getFormula: () => formula,
		}));
	}

	async #prepareGenericRoll(_roll: GenericRollData) {
		if (_roll.formulaInvalid) return null;

		const { rollFormula } = constructRollFormula({
			actor: this.#actor,
			formula: this.#applyScaling(_roll),
			item: this.#item,
		});

		if (!rollFormula) return null;

		const roll = await new CONFIG.Dice.BaseRoll(rollFormula).evaluate();
		const label = _roll.label || localize('A5E.rollLabels.generic');

		return {
			label,
			roll: roll,
			type: 'generic',
		};
	}

	async #prepareHealingRoll(_roll: HealingRollData): Promise<PreparedHealingData | null> {
		// Get Roll Formula
		const { rollFormula } = constructRollFormula({
			actor: this.#actor,
			formula: this.#applyScaling(_roll),
			item: this.#item,
		});
		if (!rollFormula) return null;

		const roll = new CONFIG.Dice.BaseRoll(rollFormula);
		// const roll = Roll.fromTerms(simplifyDiceTerms(r.terms));
		const healingType = CONFIG.A5E.healingTypes[_roll.healingType ?? 'healing'];
		const label = localize(healingType);

		return {
			label,
			userLabel: _roll.label,
			healingType: _roll.healingType,
			roll: await roll.evaluate(),
			type: 'healing',
		};
	}

	async #prepareSavingThrowRoll(_roll: SavingThrowRollData & ExtraRollData) {
		if (_roll.formulaInvalid) return null;

		const defaultData = this.#actor.getDefaultSavingThrowData(_roll.ability, {
			situationalMods: _roll.bonus,
		});

		const rollFormula = _roll.rollFormula ?? (defaultData.rollFormula as string);
		if (!rollFormula) return null;

		const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
		const roll = await new CONFIG.Dice.BaseRoll(rollFormula).evaluate();

		let label = localize('A5E.rollLabels.prompts.savingThrow', { ability });
		if (_roll.saveType === 'concentration') {
			label = localize('A5E.rollLabels.concentrationCheck');
		} else if (_roll.saveType === 'death') {
			label = localize('A5E.deathSavingThrow.title');
		}

		return {
			expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
			label,
			userLabel: _roll.label,
			roll,
			rollMode: _roll.rollMode ?? defaultData.rollMode,
			saveType: _roll.saveType ?? 'ability',
			type: 'savingThrow',
		};
	}

	async #prepareSkillCheckRoll(_roll: SkillCheckRollData & ExtraRollData) {
		if (_roll.formulaInvalid) return null;

		const skill = localize(CONFIG.A5E.skills[_roll?.skill]);

		const defaultData = this.#actor.getDefaultSkillCheckData(_roll.skill, {
			abilityKey: _roll.ability,
			situationalMods: _roll.bonus,
		});

		const ability = _roll.ability ?? defaultData.abilityKey;
		const rollFormula = _roll?.rollFormula ?? (defaultData.rollFormula as string);
		if (!rollFormula) return null;

		const roll = await new CONFIG.Dice.BaseRoll(rollFormula).evaluate();

		const label =
			ability && ability !== 'none'
				? localize('A5E.skillLabels.checks.ability', {
						skill,
						ability: CONFIG.A5E.abilityAbbreviations[ability],
					})
				: localize('A5E.skillLabels.checks.skillSpecific', { skill });

		return {
			expertiseDice: _roll?.expertiseDie ?? defaultData.expertiseDie,
			label,
			userLabel: _roll.label,
			roll,
			rollMode: _roll?.rollMode ?? defaultData.rollMode,
			skillKey: _roll?.skill,
			type: 'skillCheck',
		};
	}

	async #prepareToolCheckRoll(_roll: ToolCheckRollData) {
		if (_roll.formulaInvalid) return null;

		const abilityKey = _roll.ability === 'none' ? null : _roll.ability;
		const isProficient = this.#actor.system.proficiencies?.tools?.includes(_roll.tool);
		const modifiers: { value: string; label?: string }[] = [];

		// Flatten the tools array
		const tools = Object.values(CONFIG.A5E.tools).reduce((acc, curr) => ({ ...acc, ...curr }), {});

		const label = localize('A5E.actions.labels.toolCheckSpecific', {
			tool: localize(tools[_roll?.tool] ?? ''),
		});

		// Check if ability configured
		if (abilityKey) {
			modifiers.push({
				label: localize('A5E.abilities.headings.checkMod', {
					ability: localize(CONFIG.A5E.abilities[abilityKey]),
				}),
				value: this.#actor.system.abilities[abilityKey]?.check.mod,
			});
		}

		// Check tool prof
		if (isProficient) {
			modifiers.push({
				label: localize('A5E.Proficiency'),
				value: this.#actor.system.attributes.prof.toString(),
			});
		}

		// Add Global Ability bonus
		modifiers.push({
			label: localize('A5E.abilities.headings.checkBonusGlobal'),
			value: this.#actor.BonusesManager.getGlobalAbilityBonusesFormula('check'),
		});

		// Add Custom Bonus to Roll
		modifiers.push({
			value: _roll.bonus,
		});

		const { rollFormula } = constructD20RollFormula({
			actor: this.#actor,
			item: this.#item,
			modifiers,
		});

		if (!rollFormula) return null;

		const roll = await new CONFIG.Dice.BaseRoll(rollFormula).evaluate();

		return {
			label,
			userLabel: _roll.label,
			roll,
			type: 'toolCheck',
		};
	}

	/** ================================================ */
	//  Scaling Adjustment Methods
	/** ================================================ */
	#applyScaling(roll: DamageRollData | HealingRollData): string {
		const scalingMode = roll.scaling?.mode;

		if (!scalingMode) return roll?.getFormula() ?? 0;

		if (scalingMode === 'cantrip') return this.#applyCantripScaling(roll);
		if (scalingMode === 'spellLevel') return this.#applySpellLevelScaling(roll);
		if (scalingMode === 'spellPoints') return this.#applySpellPointScaling(roll);
		if (scalingMode === 'actionUses') return this.#applyActionUsesScaling(roll);
		if (scalingMode === 'itemUses') return this.#applyItemUsesScaling(roll);
		if (scalingMode === 'artifactCharges') return this.#applyArtifactChargesScaling(roll);
		if (scalingMode === 'resourceUses') return this.#applyResourceScaling(roll);

		return roll.getFormula() ?? 0;
	}

	#applyCantripScaling(roll: DamageRollData | HealingRollData): string {
		const actorData = this.#actor.system;

		const casterLevel: number =
			// @ts-expect-error
			this.#actor?.levels?.character ??
			// @ts-expect-error
			actorData.details.level ??
			// @ts-expect-error
			actorData.attributes.casterLevel;

		if (casterLevel < 5) return roll.getFormula();

		// Get Base
		const die = roll.die;
		const baseBonus = roll.formula;

		// Get Scaling Info
		const config = roll.scaling.config;
		const scalingDie = { number: config.number, faces: config.denom };
		const scalingBonus = new Roll(config.value || '');

		// Get multiplier
		let multiplier = 0;
		if (casterLevel >= 17) multiplier = 3;
		else if (casterLevel >= 11) multiplier = 2;
		else if (casterLevel >= 5) multiplier = 1;

		// Apply die scaling
		const scaledDie = new foundry.dice.terms.Die({
			number: (die.number ?? 0) + multiplier * scalingDie.number,
			faces: (die.denom ?? 0) + multiplier * scalingDie.faces,
			modifiers: [...die.modifiers],
		}).formula;

		const result: string[] = [];
		if (!['0d0', '0d'].includes(scaledDie)) result.push(scaledDie);
		if (baseBonus.length) result.push(baseBonus);
		if (scalingBonus.terms?.length) {
			result.push(scalingBonus.alter(multiplier, 0, { multiplyNumeric: true }).formula);
		}

		return result.join('+');
	}

	#applySpellLevelScaling(roll: DamageRollData | HealingRollData): string {
		const consumer = this.#state.consumptionData.spell ?? {};
		if (foundry.utils.isEmpty(consumer)) return roll.getFormula();

		const baseSpellLevel = consumer?.baseLevel ?? this.#item.system.level ?? 1;
		const castingLevel = consumer?.level ?? baseSpellLevel;
		const delta = castingLevel - baseSpellLevel;

		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applySpellPointScaling(roll: DamageRollData | HealingRollData): string {
		const consumer = this.#state.consumptionData.spell ?? {};
		if (foundry.utils.isEmpty(consumer)) return roll.getFormula();

		const basePoints = consumer?.basePoints || 1;
		if (basePoints >= consumer?.points) return roll.getFormula();

		const delta = Math.max(0, consumer.points - basePoints);
		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applyArtifactChargesScaling(roll: DamageRollData | HealingRollData): string {
		const consumer = this.#state.consumptionData.spell ?? {};
		if (foundry.utils.isEmpty(consumer)) return roll.getFormula();

		const baseCharges = consumer?.baseCharges || 1;
		if (baseCharges >= consumer.charges) return roll.getFormula();

		const delta = Math.max(0, consumer.charges - baseCharges);
		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applyActionUsesScaling(roll: DamageRollData | HealingRollData): string {
		const consumer = this.#state.consumptionData.actionUses;
		if (foundry.utils.isEmpty(consumer)) return roll.getFormula();

		const baseQuantity = consumer.baseUses;
		if (baseQuantity >= consumer.quantity) return roll.getFormula();

		const delta = consumer.quantity - baseQuantity;
		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applyItemUsesScaling(roll: DamageRollData | HealingRollData): string {
		const consumer = this.#state.consumptionData.itemUses;
		if (foundry.utils.isEmpty(consumer)) return roll.getFormula();

		const baseQuantity = consumer.baseUses;
		if (baseQuantity >= consumer.quantity) return roll.getFormula();

		const delta = consumer.quantity - baseQuantity;
		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applyResourceScaling(roll: DamageRollData | HealingRollData): string {
		const consumers = this.#state.consumptionData.resources ?? {};
		if (foundry.utils.isEmpty(consumers)) return roll.getFormula();

		// Find the first instance for now and use that for resource scaling;
		const consumer = Object.values(consumers).at(0);
		if (!consumer) return roll.getFormula();

		const baseQuantity = consumer.baseUses;
		if (baseQuantity >= (consumer.quantity ?? 1)) return roll.getFormula();

		const delta = consumer.quantity - baseQuantity;
		return this.#applyResourceBasedScaling(roll, delta);
	}

	#applyResourceBasedScaling(roll: DamageRollData | HealingRollData, delta: number): string {
		if (!delta) return roll.getFormula();

		// Get Base
		const die = roll.die;
		const baseBonus = roll.formula;

		// Get Scaling Info
		const config = roll.scaling.config;
		const scalingDie = { number: config.number, faces: config.denom };
		const scalingBonus = new Roll(config.value || '');

		// Get Multiplier
		const step = roll.scaling.step || 1;
		const multiplier = Math.floor(delta / step);
		if (multiplier === 0) return roll.getFormula();

		// Apply die scaling
		const scaledDie = new foundry.dice.terms.Die({
			number: (die.number ?? 0) + multiplier * scalingDie.number,
			faces: (die.denom ?? 0) + multiplier * scalingDie.faces,
			modifiers: [...die.modifiers],
		}).formula;

		const result: string[] = [];
		if (!['0d0', '0d'].includes(scaledDie)) result.push(scaledDie);
		if (baseBonus.length) result.push(baseBonus);
		if (scalingBonus.terms?.length) {
			result.push(scalingBonus.alter(multiplier, 0, { multiplyNumeric: true }).formula);
		}

		console.log(result);

		return result.join('+');
	}
}

declare namespace RollPreparationManager {
	type PreparedAttackData = {
		attackType:
			| 'meleeWeaponAttack'
			| 'rangedWeaponAttack'
			| 'meleeSpellAttack'
			| 'rangedSpellAttack';
		critThreshold: number;
		expertiseDice: number;
		isCrit: boolean;
		label: string;
		roll: EvaluatedRoll;
		rollMode: number;
		type: 'attack';
	} | null;

	interface ExtraRollData {
		rollFormula?: string;
		expertiseDie?: number;
		rollMode?: number;
		saveType?: 'ability' | 'concentration' | 'death';
	}

	interface DamageRollOptions {
		applyGenericBonus?: boolean;
		context?: RollStateManager.WorkflowState['damageBonuses'][number];
	}
}

type ExtraRollData = RollPreparationManager.ExtraRollData;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type EvaluatedRoll = Awaited<ReturnType<InstanceType<typeof Roll<{}>>['evaluate']>>;

interface PreparedDamageData {
	baseRoll: EvaluatedRoll;
	canCrit: boolean;
	critRoll: EvaluatedRoll;
	damageType: string;
	label: string;
	userLabel: string;
	roll: EvaluatedRoll;
	type: 'damage';
}

interface PreparedHealingData {
	label: string;
	userLabel: string;
	healingType: string;
	roll: EvaluatedRoll;
	type: 'healing';
}

export { RollPreparationManager };
