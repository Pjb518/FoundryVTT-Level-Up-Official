import type { ActionActivationOptions } from '#documents/item/data.ts';
import { computeSaveDC } from '#utils/computeSaveDC.ts';
import getAttackAbility from '#utils/getAttackAbility.ts';
import { getRollFormula } from '#utils/getRollFormula.ts';
import type {
	AmmunitionConsumerData,
	SpellConsumerData,
} from '../dataModels/item/actions/ActionConsumersDataModel.ts';
import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';
import { EffectAreaManager } from './EffectAreaManager.ts';
import { ResourceConsumptionManager } from './ResourceConsumptionManager.ts';
import { RollOverrideManager } from './RollOverrideManager.ts';
import { RollPreparationManager } from './RollPreparationManager.ts';

class RollStateManager {
	#actor: Actor.OfType<'base'>;

	#item: ItemA5e;

	#actionId: string;

	#action: A5EActionData;

	#state: RollStateManager.state;

	#options: ActionActivationOptions;

	constructor(item: ItemA5e, actionId: string, options: ActionActivationOptions) {
		this.#item = item;
		this.#actor = item.actor;
		this.#actionId = actionId;
		this.#options = options;

		const action = item.actions.get(actionId)!;
		this.#action = action;

		this.#state = this._prepareInitialState();
	}

	/** ================================================ */
	//  Getters
	/** ================================================ */
	get state() {
		return this.#state;
	}

	/** ================================================ */
	//  Pre Dialog State
	/** ================================================ */
	_prepareInitialState() {
		// Get Base roll data
		const consumers = this.#action.getConsumersByType();
		let prompts = this.#action.getPromptsByType() ?? {};
		let rolls = this.#action.getRollsByType() ?? {};
		const effects = [...this.#action._effects].map(([, effect]) => effect);

		// Get base defaults
		let defaultPrompts = this.#action.getDefaultIds('prompts');
		let defaultRolls = this.#action.getDefaultIds('rolls');
		const defaultEffects = this.#action.selectedEffects;

		// Get Targets
		const targets = [...game.user.targets];

		// Prepare Attack roll data b4 ammo to preserve attack roll
		const attackRoll = rolls.attack?.length ? rolls.attack.at(0) : null;
		const attackRollConfig = this.#prepareAttackRollConfig(attackRoll, targets);

		// Check if there is an ammunition consumer and add rolls, prompts, and effects
		if (consumers.ammunition) {
			const additional = this.#prepareAmmunitionData(consumers.ammunition);
			//
			// Add if type is bonus
			if (additional !== null && additional.type === 'bonus') {
				// Merge prompts
				Object.entries(additional.prompts).forEach(([type, p]) => {
					prompts[type] ??= [];
					prompts[type].push(...p);
				});
				defaultPrompts.push(...additional.defaultPrompts);

				// Merge Rolls
				Object.entries(additional.rolls).forEach(([type, r]) => {
					if (type === 'attack') return;
					rolls[type] ??= [];
					rolls[type].push(...r);
				});
				defaultRolls.push(...additional.defaultRolls);

				// Merge Effects
				effects.push(...additional.effects);
				defaultEffects.push(...additional.defaultEffects);

				// Override rolls and prompts if ammo is of type override
			} else if (additional !== null && additional.type === 'override') {
				prompts = additional.prompts;
				defaultPrompts = additional.defaultPrompts;

				rolls = additional.rolls;
				defaultRolls = additional.defaultRolls;
			}
		}

		const { BonusesManager } = this.#actor;
		const damageBonuses = BonusesManager._prepareGlobalDamageBonuses(this.#item, rolls);
		const healingBonuses = BonusesManager._prepareGlobalHealingBonuses(this.#item, rolls);

		const config = {
			attackRoll: attackRollConfig,
			defaults: {
				consumers: this.#action.getDefaultIds('consumers'),
				prompts: defaultPrompts,
				rolls: defaultRolls,
				attackBonuses: BonusesManager.getDefaultSelections('attacks', {
					item: this.#item,
					attackType: attackRoll?.attackType,
				}),
				effects: defaultEffects,
				damageBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ damageBonuses }),
				healingBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ healingBonuses }),
			},
			invalids: {
				rolls: this.#action.invalidRolls,
				prompts: this.#action.invalidPrompts,
			},
		};

		return {
			// Encapsulation
			action: this.#action,
			actor: this.#actor,
			item: this.#item,

			config,

			// Props
			consumers,
			effects,
			prompts,
			rolls,

			// Other
			attackRoll,
			damageBonuses,
			healingBonuses,
			targets,
		};
	}

	/**
	 *
	 * @param attackRoll
	 * @returns
	 */
	#prepareAttackRollConfig(attackRoll: AttackRollData | null | undefined, targets: Token[]) {
		if (!attackRoll) return null;

		const { attackType } = attackRoll;
		const overrideManager = RollOverrideManager;
		const srcConfig = this.#actor.system.rolls.attack[attackType].outgoing;

		const attackAbility = getAttackAbility(this.#actor, this.#item, attackRoll);

		const targetSrc =
			targets.length === 0 || targets.length > 1
				? undefined
				: targets.map((t) => t.actor?.system?.rolls?.attack?.[attackType]?.incoming).at(0);

		const expertiseData = overrideManager.resolveExpertiseDie(srcConfig, { targetSrc });

		const expertiseDie = expertiseData.value;
		const expertiseDieSource = expertiseData.source;

		// Get Roll Mode
		const rollModeData = overrideManager.resolveRollMode(
			srcConfig,
			this.#options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
			{ targetSrc },
		);

		const rollMode = rollModeData.value;
		const rollModeSource = rollModeData.source;

		const selectedAttackBonuses = this.#actor.BonusesManager.getDefaultSelections('attacks', {
			item: this.#item,
			attackType,
		});

		const formula = getRollFormula(
			this.#actor,
			{
				ability: attackAbility,
				attackBonus: attackRoll.bonus,
				attackType,
				expertiseDie,
				proficient: attackRoll.proficient ?? true,
				rollMode,
				situationalMods: this.#options.situationalMods || '',
				selectedAttackBonuses,
				type: 'attack',
			},
			{ terms: true },
		);

		return {
			ability: attackAbility,
			bonuses: this.#actor.BonusesManager.prepareAttackBonuses(this.#item, attackRoll.attackType),
			expertiseDie,
			expertiseDieSource,
			formula,
			rollMode,
			rollModeSource,
			selectedAttackBonuses,
		};
	}

	#prepareAmmunitionData(consumer: AmmunitionConsumerData) {
		const item = this.#actor.items.get(consumer?.itemId);
		if (!item) return null;

		// @ts-expect-error
		const action = item.actions.first as A5EActionData;
		if (!action) return null;

		// Get rolls, prompts, and effects
		const effects = [...action._effects].map(([, effect]) => effect);
		const prompts = action.getPromptsByType() ?? {};
		const rolls = action.getRollsByType() ?? {};
		const type = item.system.ammunitionDamageMode;

		// Get defaults
		const defaultPrompts = action.getDefaultIds('prompts');
		const defaultRolls = action.getDefaultIds('rolls');
		const defaultEffects = action.selectedEffects;

		return { defaultPrompts, defaultRolls, defaultEffects, prompts, rolls, effects, type };
	}

	/** ================================================ */
	//  Post Dialog State
	/** ================================================ */
	_preparePostDialogState(data: RollStateManager.ActionDialogData) {
		const damageBonuses = this.#state.damageBonuses
			.filter(([key]) => data.selectedDamageBonuses.includes(key))
			.map(([, bonus]) => bonus);

		const healingBonuses = this.#state.healingBonuses
			.filter(([key]) => data.selectedHealingBonuses.includes(key))
			.map(([, bonus]) => bonus);

		const consumers = Object.values(this.#state.consumers)
			.flat()
			.filter((consumer) => {
				if (!consumer) return false;
				if (data.selectedConsumers.includes(consumer.id)) return true;
				return false;
			});

		const prompts = Object.values(this.#state.prompts)
			.flat()
			.filter((prompt) => {
				if (!prompt) return false;
				if (prompt.type === 'savingThrow') {
					prompt.dc = computeSaveDC(this.#actor, this.#item, prompt.saveDC) ?? 0;
				}
				if (data.selectedPrompts.includes(prompt.id)) return true;
				return false;
			});

		const rolls = Object.values(this.#state.rolls)
			.flat()
			.filter((roll) => {
				if (roll?.type === 'attack') return false;
				if (data.selectedRolls.includes(roll?.id)) return true;
				return false;
			});

		return {
			// Self encapsulation for easy passing
			actor: this.#actor,
			item: this.#item,
			action: this.#action,

			// State Data
			attack: data.attack,
			consumers: consumers,
			consumptionData: data.consumptionData,
			damageBonuses: damageBonuses,
			effects: data.effects,
			healingBonuses: healingBonuses,
			prompts: prompts,
			rolls: rolls,
			targets: this.#state.targets,
		};
	}

	/** ================================================ */
	//  Workflow Methods
	/** ================================================ */
	async startWorkflow(data: RollStateManager.ActionDialogData) {
		const state = this._preparePostDialogState(data);

		// Prepare Prompts
		const prompts = state.prompts;

		// Prepare rolls
		const rolls = await new RollPreparationManager(state).prepareRolls();

		// Consumer resources
		await new ResourceConsumptionManager(state).consumeResources();

		// Get Region Data
		const eAManager = new EffectAreaManager(state);
		const validShape = eAManager.validateBaseTemplateData();
		const shapeData = validShape ? eAManager.getShapeData() : null;

		// Prepare effects
		this.handleEffects(state.effects);

		return { prompts, rolls, shapeData };
	}

	async handleEffects(effectIds: string[]) {
		effectIds.forEach((uuid) => {
			const effect = fromUuidSync(uuid) as ActiveEffect | undefined;
			if (!effect) return;
			if (!effect.system.applyToSelf) return;
			// @ts-expect-error Will fix when effects are typed
			effect.transferEffect(this.#actor);
		});

		// Handle Concentration automation
		if (this.#action.requiresConcentration) {
			// Remove concentration if it alreay exists
			if (this.#actor.statuses.has('concentration')) {
				await this.#actor.toggleStatusEffect('concentration', { active: false });
			}

			// Construct Updates
			const updates: Record<string, any> = {};
			const duration = this.#action.duration;
			// @ts-expect-error
			const validUnit = CONST.ACTIVE_EFFECT_DURATION_UNITS.includes(`${duration.unit}s`);
			if (duration.value && validUnit) {
				updates['duration.value'] = duration.value;
				updates['duration.units'] = `${duration.unit}s`;
			}

			updates.origin = this.#item.uuid;

			// Add concentration condition
			this.#actor.toggleStatusEffect('concentration', { active: true, updates });
		}
	}
}

declare namespace RollStateManager {
	type ActionDialogData = {
		attack: AttackRollData & {
			expertiseDie: number;
			rollMode: number;
			formula: string;
			terms: foundry.dice.terms.RollTerm[];
		};
		consumptionData: {
			actionUses: { baseUses: number; quantity: number };
			hitDice: { selected: Record<string, number>; quantity: number };
			itemUses: { baseUses: number; quantity: number };
			resources: Record<string, { baseUses: number; quantity: number }>;
			spell: ReturnType<SpellConsumerData['getActivationData']>['spellData'];
		};
		effects: string[];
		selectedDamageBonuses: string[];
		selectedHealingBonuses: string[];
		selectedConsumers: string[];
		selectedPrompts: string[];
		selectedRolls: string[];
		visibilityMode: string;
	};

	type state = ReturnType<RollStateManager['_prepareInitialState']>;

	type WorkflowState = ReturnType<RollStateManager['_preparePostDialogState']>;
}

export { RollStateManager };
