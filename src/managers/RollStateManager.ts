import type { ActionActivationOptions } from '#documents/item/data.ts';
import { computeSaveDC } from '#utils/computeSaveDC.ts';
import getAttackAbility from '#utils/getAttackAbility.ts';
import { getRollFormula } from '#utils/getRollFormula.ts';
import type { SpellConsumerData } from '../dataModels/item/actions/ActionConsumersDataModel.ts';
import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';
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
		const consumers = this.#action.getConsumersByType();
		const prompts = this.#action.getPromptsByType();
		const rolls = this.#action.getRollsByType();
		const effects = [...this.#action._effects].map(([, effect]) => effect);

		const { BonusesManager } = this.#actor;
		const damageBonuses = BonusesManager._prepareGlobalDamageBonuses(this.#item, rolls);
		const healingBonuses = BonusesManager._prepareGlobalHealingBonuses(this.#item, rolls);

		// Get Targets
		const targets = [...game.user.targets];

		// TODO:
		const attackRoll = rolls.attack?.length ? rolls.attack.at(0) : null;
		const attackRollConfig = this.#prepareAttackRollConfig(attackRoll, targets);

		const config = {
			attackRoll: attackRollConfig,
			defaults: {
				consumers: this.#action.getDefaultIds('consumers'),
				prompts: this.#action.getDefaultIds('prompts'),
				rolls: this.#action.getDefaultIds('rolls'),
				attackBonuses: BonusesManager.getDefaultSelections('attacks', {
					item: this.#item,
					attackType: attackRoll?.attackType,
				}),
				damageBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ damageBonuses }),
				healingBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ healingBonuses }),
			},
			invalids: {
				rolls: this.#action.invalidRolls,
				prompts: this.#action.invalidPrompts,
			},
		};

		return {
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

		const formula = getRollFormula(this.#actor, {
			ability: attackAbility,
			attackBonus: attackRoll.bonus,
			attackType,
			expertiseDie,
			proficient: attackRoll.proficient ?? true,
			rollMode,
			situationalMods: this.#options.situationalMods || '',
			selectedAttackBonuses,
			type: 'attack',
		});

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

		const consumers = Object.values(this.#action.consumers ?? {}).reduce(
			(acc, consumer) => {
				if (data.selectedConsumers.includes(consumer.id)) acc.push(consumer);
				return acc;
			},
			[] as A5EActionData['consumers'][string][],
		);

		const prompts = Object.values(this.#action.prompts ?? {}).reduce(
			(acc, prompt) => {
				if (prompt.type === 'savingThrow') {
					prompt.dc = computeSaveDC(this.#actor, this.#item, prompt.saveDC) ?? 0;
				}
				if (data.selectedPrompts.includes(prompt.id)) acc.push(prompt);
				return acc;
			},
			[] as A5EActionData['prompts'][string][],
		);

		const rolls = Object.values(this.#action.rolls ?? {}).reduce(
			(acc, roll) => {
				if (roll.type === 'attack') return acc;
				if (data.selectedRolls.includes(roll.id)) acc.push(roll);
				return acc;
			},
			[] as A5EActionData['rolls'][string][],
		);

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

		// TODO: Make this one line
		// Prepare rolls
		const RollManager = new RollPreparationManager(state);
		const rolls = await RollManager.prepareRolls();
		console.log(rolls);
	}
}

declare namespace RollStateManager {
	type ActionDialogData = {
		attack: AttackRollData & {
			expertiseDie: number;
			rollMode: number;
			formula: string;
		};
		consumptionData: {
			actionUses: { baseUses: number; quantity: number };
			hitDice: { selected: Record<string, number>; quantity: number };
			itemUses: { baseUses: number; quantity: number };
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
